const getStartDateFromRange = (range) => {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),

    now.getMonth(),

    now.getDate()
  );

  switch (range) {
    case "TODAY": {
      return {
        startDate: startOfToday,

        endDate: now,
      };
    }

    case "YESTERDAY": {
      const startOfYesterday = new Date(startOfToday);

      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      const endOfYesterday = new Date(startOfToday);

      endOfYesterday.setMilliseconds(-1);

      return {
        startDate: startOfYesterday,

        endDate: endOfYesterday,
      };
    }

    case "1M": {
      return {
        startDate: new Date(
          now.getFullYear(),

          now.getMonth() - 1,

          now.getDate()
        ),

        endDate: now,
      };
    }

    case "3M": {
      return {
        startDate: new Date(
          now.getFullYear(),

          now.getMonth() - 3,

          now.getDate()
        ),

        endDate: now,
      };
    }

    case "6M": {
      return {
        startDate: new Date(
          now.getFullYear(),

          now.getMonth() - 6,

          now.getDate()
        ),

        endDate: now,
      };
    }

    case "1Y": {
      return {
        startDate: new Date(
          now.getFullYear() - 1,

          now.getMonth(),

          now.getDate()
        ),

        endDate: now,
      };
    }

    case "ALL": {
      return {
        startDate: new Date(0), // Beginning of time
        endDate: now,
      };
    }

    default: {
      return {
        startDate: new Date(0),
        endDate: now,
      };
    }
  }
};

module.exports = { getStartDateFromRange };
