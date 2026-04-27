window.strokeColors = {
    pink: "#e73754ff",        // 1. Hồng
    black: "#000000",       // 2. Đen
    orange: "#FFA500",      // 3. Cam
    blue: "#0000FF",        // 4. Xanh dương
    yellow: "#FFFF00",      // 5. Vàng
    green: "#008000",       // 6. Xanh lá
    purple: "#800080",      // 7. Tím
    lightBlue: "#ADD8E6"    // 8. Xanh dương nhạt
};

// 2. Tạo mảng phụ để truy xuất theo index
const colorList = Object.values(window.strokeColors);

/**
 * 3. Biến global để lấy màu theo index (hỗ trợ vòng lặp)
 * @param {number} index - Thứ tự nét vẽ (thường bắt đầu từ 1 hoặc 0)
 */
window.getStrokeColor = function (index) {
    // Nếu bạn truyền vào số thứ tự nét (1, 2, 3...) thì trừ 1 để về index mảng (0, 1, 2...)
    // Nếu bạn đã truyền đúng index 0-based thì có thể bỏ "- 1"
    const i = Math.max(0, index - 1);
    return colorList[i % colorList.length];
};