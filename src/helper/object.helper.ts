import dayjs from "dayjs";

export const ObjectHelper = {
  formatDate(date: Date, pattern = "DD-MM-YYYY HH:mm:ss"): string {
    return dayjs(date).format(pattern);
  },
  getParamsFilter(data: any) {
    const obj = {
      ...data,
    };

    Object.keys(obj).forEach((key: any) => {
      if (
        obj[key] === null ||
        obj[key] === undefined ||
        (typeof obj[key] === "string" && obj[key]?.trim() === "")
      ) {
        delete obj[key];
      }
    });

    const params = new URLSearchParams(obj).toString();
    return params;
  },
  getListValueByProperty(objectList: any, field: any) {
    if (!objectList) {
      return [];
    }
    return objectList.map((x: any) => x[field]);
  },
  generateMonthInRange(start: any, end: any) {
    var startDate = dayjs(start);
    startDate.subtract(1, "month"); //Substract one month to exclude endDate itself
    var endDate = dayjs(end);
    var dates = [];
    var month = dayjs(startDate); //clone the startDate
    while (month.isBefore(endDate)) {
      month = month.add(1, "month");
      dates.push(month.format("MM-YYYY"));
    }
    return dates;
  },
  zeroPad(num: any, size: any = 2) {
    if (!num) return 0;
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  },
  toFixed(num: any, size: any = 2) {
    if (typeof num == "number") return Number(num).toFixed(size);
    if (!num || num == null || !num.length) return 0;
    if (num.length && !num[0]) return 0;

    let res = num;
    try {
      res = Number(parseFloat(num)).toFixed(size);
    } catch (ex) {
      res = 5555;
    }
    return res;
  },
  groupByField: (data: any, field: any) => {
    let groups = data.reduce(function (obj: any, item: any) {
      obj[item[field]] = obj[item[field]] || [];
      obj[item[field]].push(item);
      return obj;
    }, {});
    var result = Object.keys(groups).map(function (key) {
      return { [field]: key, data: groups[key] };
    });
    return result;
  },
  groupListByField: (list: any, groupField: string, key: string = "Id") => {
    var map: any = {},
      node,
      roots = [],
      i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i][key]] = i;
      list[i].children = [];
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node[groupField] !== 0) {
        list[map[node[groupField]]]?.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },
  callApi: (promise: Promise<any>) => {
    return promise
      .then(({ data }) => {
        return data?.data;
      })
      .catch(({ response }) => {
        throw response?.data?.message || "Something went wrong.";
      });
  },
  download: async (promise: Promise<any>, fileName: string) => {
    try {
      const response = await promise;

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      throw "Something went wrong.";
    }
  },
  calculateDataSize: (data: any) => {
    const jsonString = JSON.stringify(data);
    const dataSizeInBytes = new Blob([jsonString]).size;
    const dataSizeInMegabytes = dataSizeInBytes / (1024 * 1024); // MB
    return dataSizeInMegabytes;
  },
};
