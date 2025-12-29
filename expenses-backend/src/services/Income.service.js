const incomeModel = require("../models/Income.model");

let incomeService = {};

incomeService.addIncome = async (incomeObj) => {
    try {
        const resObj = await incomeModel.create(incomeObj);
        return resObj;
    } catch (error) {
        console.log("Income Service addIncome() method Error: ", error);
        throw error;
    }
};

incomeService.fetchIncomesByUserId = async (userId, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const incomes = await incomeModel
            .find({ userId: userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await incomeModel.countDocuments({ userId: userId });

        return {
            incomes: incomes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.log("Income Service fetchIncomesByUserId() method Error: ", error);
        throw error;
    }
};

incomeService.updateIncome = async (incomeId, incomeObj) => {
    try {
        const resObj = await incomeModel.findByIdAndUpdate(
            incomeId,
            { $set: incomeObj },
            { new: true }
        );
        return resObj;
    } catch (error) {
        console.log("Income Service updateIncome() method Error: ", error);
        throw error;
    }
};

incomeService.deleteIncome = async (userId, incomeId) => {
    try {
        const resObj = await incomeModel.deleteOne({ _id: incomeId, userId: userId });
        if (resObj.deletedCount > 0) {
            return { message: "Deletion Successful!" };
        }
        return null;
    } catch (error) {
        console.log("Income Service deleteIncome() method Error: ", error);
        throw error;
    }
};

incomeService.fetchIncomesByCategory = async (userId, categoryName, page = 1, limit = 10) => {
    try {
        const incomes = await incomeModel
            .find({ userId: userId, categoryName: categoryName })
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await incomeModel.countDocuments({
            userId: userId,
            categoryName: categoryName
        });

        return {
            incomes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.log("Income Service fetchIncomesByCategory() method Error: ", error);
        throw error;
    }
};

incomeService.fetchIncomesByDate = async (userId, startDate, endDate, page = 1, limit = 10) => {
    try {
        const incomes = await incomeModel.find({
            userId: userId,
            date: { $gte: startDate, $lte: endDate }
        })
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await incomeModel.countDocuments({
            userId: userId,
            date: { $gte: startDate, $lte: endDate }
        });

        return {
            incomes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.log("Income Service fetchIncomesByDate() method Error: ", error);
        throw error;
    }
};

incomeService.fetchIncomesBySearch = async (userId, search, page = 1, limit = 10) => {
    try {
        const query = {
            userId: userId,
            $or: [
                { source: { $regex: search, $options: "i" } },
                { categoryName: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } }
            ]
        };

        const incomes = await incomeModel.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await incomeModel.countDocuments(query);

        return {
            incomes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.log("Income Service fetchIncomesBySearch() method Error: ", error);
        throw error;
    }
};

module.exports = incomeService;
