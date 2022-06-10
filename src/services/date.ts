export function getNextDayOfWeek(date: Date, dayOfWeek: number): Date {

    var resultDate = new Date(date.getTime());
  
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
  
    return resultDate;
  }