// Hàm chuyển đổi sang giờ Việt Nam
export const convertToVietnamTime = (isoString: string): string => {
  const date = new Date(isoString);

  const vietnamTime = date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false, // sử dụng định dạng 24 giờ
  });

  return vietnamTime;
};

export const convertToVietnamDate = (isoString: string): string => {
  const date = new Date(isoString);

  const vietnamDate = date.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  return vietnamDate;
};

export const convertDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
