# Gauss-Jordan Calculator - Công cụ học tập tương tác

Một ứng dụng web tương tác được thiết kế để giúp người dùng hiểu và thực hành phương pháp khử Gauss-Jordan, một khái niệm cơ bản trong đại số tuyến tính. Ứng dụng cung cấp hiển thị từng bước của quá trình biến đổi ma trận, hỗ trợ cả tính toán số và tính toán với tham số.

## ✨ Tính năng nổi bật

- **Hiển thị từng bước:** Theo dõi quá trình khử Gauss-Jordan với giải thích chi tiết cho mỗi phép biến đổi hàng.
- **Chế độ số học:** Nhập ma trận số và xem kết quả chính xác.
- **Chế độ tham số (Symbolic Mode):** Thực hiện phép khử Gauss-Jordan với các biến (ví dụ: a, b, k) trong ma trận.
- **Hiển thị phân số:** Tùy chọn hiển thị kết quả dưới dạng phân số tối giản hoặc số thập phân.
- **Quiz Mode:** Kiểm tra kiến thức của bạn với các bài tập tương tác (Tính năng đang phát triển/có thể được thêm vào).
- **Chủ đề Sáng/Tối (Light/Dark Theme):** Chuyển đổi giữa chủ đề sáng và tối để phù hợp với sở thích của bạn, với hiệu ứng chuyển đổi mượt mà.
- **Thiết kế đáp ứng (Responsive Design):** Giao diện người dùng được tối ưu hóa cho cả máy tính để bàn và thiết bị di động.
- **Ví dụ có sẵn:** Nhanh chóng tải các ma trận ví dụ cho cả chế độ số và tham số.
- **Điều khiển tốc độ hoạt ảnh:** Tùy chỉnh tốc độ của hoạt ảnh từng bước.

## 🛠️ Công nghệ sử dụng

- **Next.js:** Framework React để render phía server và xây dựng ứng dụng web hiện đại.
- **React:** Thư viện JavaScript để xây dựng giao diện người dùng.
- **TypeScript:** Ngôn ngữ lập trình JavaScript được định kiểu mạnh mẽ.
- **Tailwind CSS:** Framework CSS ưu tiên tiện ích để tạo kiểu nhanh chóng và tùy chỉnh.
- **Lucide React:** Thư viện biểu tượng (icons) đẹp và nhất quán.
- **Radix UI (via shadcn/ui):** Các primitive UI không định kiểu, có thể truy cập được để xây dựng các thành phần giao diện chất lượng cao.

## 🚀 Bắt đầu

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau:

### Điều kiện tiên quyết

- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên được khuyến nghị)
- [pnpm](https://pnpm.io/) (hoặc npm/yarn)

### Cài đặt

1.  **Clone repository (nếu có):**
    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Cài đặt các gói phụ thuộc:**
    Sử dụng pnpm (khuyến nghị):
    ```bash
    pnpm install
    ```
    Hoặc npm:
    ```bash
    npm install
    ```
    Hoặc yarn:
    ```bash
    yarn install
    ```

### Chạy ứng dụng

1.  **Khởi động máy chủ phát triển:**
    ```bash
    pnpm dev
    ```
    Hoặc npm:
    ```bash
    npm run dev
    ```
    Hoặc yarn:
    ```bash
    yarn dev
    ```

2.  Mở trình duyệt của bạn và truy cập `http://localhost:3000` (hoặc cổng được chỉ định trong terminal của bạn).

## 📁 Cấu trúc thư mục (Tổng quan)

-   `app/`: Chứa các tệp định tuyến chính của ứng dụng Next.js (ví dụ: `page.tsx`, `layout.tsx`).
-   `components/`: Chứa các thành phần React tái sử dụng, bao gồm cả các thành phần UI (ví dụ: `matrix-calculator.tsx`, `ui/button.tsx`).
-   `hooks/`: Chứa các React hook tùy chỉnh.
-   `lib/`: Chứa các hàm tiện ích (ví dụ: `utils.ts`).
-   `public/`: Chứa các tài sản tĩnh (ví dụ: hình ảnh, favicon).
-   `styles/`: Chứa các tệp CSS toàn cục (ví dụ: `globals.css`).
-   `tailwind.config.ts`: Tệp cấu hình cho Tailwind CSS.
-   `tsconfig.json`: Tệp cấu hình cho TypeScript.

## 📖 Cách sử dụng

1.  **Chọn kích thước ma trận:** Sử dụng các menu thả xuống để chọn số hàng (1-5) và số cột (1-5).
2.  **Nhập giá trị ma trận:**
    -   **Chế độ số:** Nhập các giá trị số vào các ô của ma trận.
    -   **Chế độ tham số:** Bật công tắc "Chế độ" sang biểu tượng biến (Variable). Nhập các số hoặc tham số (ví dụ: `a`, `b`, `2*k`, `m-1`) vào các ô.
3.  **Bắt đầu tính toán:** Nhấp vào nút "Bắt đầu tính toán".
4.  **Xem các bước:**
    -   Sử dụng các nút "Trước", "Sau" và "Phát/Tạm dừng" để điều hướng qua các bước biến đổi.
    -   Mô tả của mỗi phép biến đổi được hiển thị bên dưới ma trận.
5.  **Tùy chọn hiển thị:**
    -   Sử dụng công tắc "Hiển thị phân số" để chuyển đổi giữa việc hiển thị số thập phân và phân số tối giản (chỉ áp dụng cho chế độ số).
    -   Điều chỉnh "Tốc độ" của hoạt ảnh và "Độ chính xác" cho số thập phân bằng thanh trượt.
6.  **Reset:** Nhấp vào nút "Reset" để xóa các bước và nhập ma trận mới.
7.  **Tải ví dụ:** Sử dụng các nút "Ví dụ có tham số" hoặc "Ví dụ số" để tải các ma trận được xác định trước.
8.  **Chuyển đổi chủ đề:** Nhấp vào biểu tượng mặt trăng/mặt trời ở góc trên bên phải của tiêu đề để chuyển đổi giữa chủ đề sáng và tối.