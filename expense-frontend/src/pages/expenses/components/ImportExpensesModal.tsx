import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";

interface ImportExpensesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportExpensesModal = ({ open, onClose, onSuccess }: ImportExpensesModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

    const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bstr = e.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        const parseExcelDate = (dateVal: any) => {
          if (!dateVal) return new Date().toISOString();
          
          // Handle Excel Serial Date (numbers)
          if (typeof dateVal === 'number') {
             return new Date((dateVal - 25569) * 86400 * 1000).toISOString();
          }

          // Handle String dates
          if (typeof dateVal === 'string') {
            const ddmmyyyy = dateVal.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
            if (ddmmyyyy) {
              const day = parseInt(ddmmyyyy[1], 10);
              const month = parseInt(ddmmyyyy[2], 10) - 1; 
              const year = parseInt(ddmmyyyy[3], 10);
              return new Date(year, month, day).toISOString();
            }
            const parsed = new Date(dateVal);
            if (!isNaN(parsed.getTime())) return parsed.toISOString();
          }

          return new Date().toISOString();
        };

        const getValue = (row: any, keys: string[]) => {
          const rowKeys = Object.keys(row);
          for (const key of keys) {
            const match = rowKeys.find(k => k.trim().toLowerCase() === key.toLowerCase());
            if (match) return row[match];
          }
          return undefined;
        };

        const formattedData = rawData.map((row: any) => {
          const description = getValue(row, ["Description", "Desc"]) || "Imported Expense";
          const amount = parseFloat(getValue(row, ["Amount", "Amt", "Cost", "Price"]) || "0");
          const categoryName = getValue(row, ["Category", "Category Name", "Cat"]) || "Uncategorized";
          const merchant = getValue(row, ["Merchant", "Vendor", "Payee"]) || "";
          const paymentMethod = getValue(row, ["PaymentMethod", "Payment Method", "Method"]) || "Cash";
          const dateVal = getValue(row, ["Date", "Txn Date", "Transaction Date"]);

          return {
            date: parseExcelDate(dateVal),
            description,
            amount,
            categoryName,
            merchant,
            paymentMethod,
            status: "completed"
          };
        });

        console.log(formattedData);
        setData(formattedData);
        setError(null);
      } catch (err) {
        setError("Failed to parse Excel file. Please ensure it follows the correct format.");
        setData([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (data.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      await api.post(API_ENDPOINTS.EXPENSES.IMPORT, { expenses: data });
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setData([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-primary-gradient text-white border-0 py-3">
            <h5 className="modal-title fw-bold">Import Expenses</h5>
            <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-2">Upload Excel File (.xlsx)</label>
              <input
                ref={fileInputRef}
                type="file"
                className="form-control rounded-3 py-2"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              {file && (
                <div className="mt-2 small text-primary-custom fw-bold d-flex align-items-center gap-1">
                  <i className="bi bi-file-earmark-check-fill"></i>
                  {file.name}
                </div>
              )}
              <div className="mt-2 extra-small text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Expected columns: Date, Description, Amount, Category, Merchant, PaymentMethod
              </div>
            </div>

            {error && (
              <div className="alert alert-danger rounded-3 border-0 small py-2 mb-4 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {data.length > 0 && (
              <div>
                <h6 className="fw-bold text-dark mb-3 d-flex justify-content-between align-items-center">
                  Preview ({data.length} records)
                  <span className="badge bg-primary-light text-primary-custom rounded-pill">Validated</span>
                </h6>
                <div className="table-responsive rounded-3 border mb-4" style={{ maxHeight: '300px' }}>
                  <table className="table table-hover table-sm mb-0">
                    <thead className="bg-light sticky-top">
                      <tr>
                        <th className="ps-3 py-2 small fw-bold">Date</th>
                        <th className="py-2 small fw-bold">Description</th>
                        <th className="py-2 small fw-bold text-end pe-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 10).map((row, idx) => (
                        <tr key={idx}>
                          <td className="ps-3 py-2 small text-muted">{new Date(row.date).toLocaleDateString()}</td>
                          <td className="py-2 small fw-medium">{row.description}</td>
                          <td className="py-2 small text-end pe-3 fw-bold text-primary-custom">₹{row.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      {data.length > 10 && (
                        <tr>
                          <td colSpan={3} className="text-center py-2 extra-small text-muted italic">
                            + {data.length - 10} more records...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer bg-light border-0 py-3">
            <button type="button" className="btn btn-light px-4 rounded-3 fw-bold" onClick={handleClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary-gradient px-4 rounded-3 fw-bold d-flex align-items-center gap-2"
              onClick={handleImport}
              disabled={loading || data.length === 0}
            >
              {loading && <span className="spinner-border spinner-border-sm"></span>}
              Confirm Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExpensesModal;
