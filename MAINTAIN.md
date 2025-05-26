# Hướng dẫn Bảo trì Dự án

Tài liệu này cung cấp hướng dẫn và các phương pháp tốt nhất để bảo trì dự án Gauss-Jordan Calculator.

## Tổng quan về Kiến trúc

-   **Framework:** Next.js (với App Router)
-   **Ngôn ngữ:** TypeScript
-   **UI:** React, Tailwind CSS, shadcn/ui (Radix UI + Tailwind)
-   **Quản lý Trạng thái:** Chủ yếu sử dụng React Hooks (`useState`, `useEffect`). Trạng thái phức tạp hơn được quản lý cục bộ trong các thành phần liên quan (ví dụ: `matrix-calculator.tsx`). `next-themes` được sử dụng để quản lý chủ đề.
-   **Logic Chính:**
    -   `app/page.tsx`: Trang chính, bố cục tổng thể và tích hợp các thành phần chính.
    -   `components/matrix-calculator.tsx`: Chứa phần lớn logic cho việc nhập ma trận, tính toán Gauss-Jordan (cả số và tham số), quản lý các bước, hiển thị ma trận và các điều khiển liên quan.
    -   `components/theme-provider.tsx`: Cung cấp chức năng chuyển đổi chủ đề sáng/tối.
    -   `lib/utils.ts`: Chứa các hàm tiện ích, ví dụ `cn` để hợp nhất các lớp Tailwind CSS một cách có điều kiện.
    -   `styles/globals.css`: Định nghĩa các biến CSS toàn cục (ví dụ: màu sắc cho chủ đề) và các kiểu cơ sở.

## Quy trình Phát triển

### Nhánh (Branching)

-   Sử dụng `main` (hoặc `master`) cho mã nguồn ổn định, đã được phát hành.
-   Tạo các nhánh tính năng (feature branches) từ `main` cho các tính năng mới hoặc sửa lỗi (ví dụ: `feat/add-quiz-mode`, `fix/fraction-display-bug`).
-   Tạo Pull Requests (PRs) để merge các nhánh tính năng vào `main`.
-   Đảm bảo PRs được review trước khi merge (nếu làm việc trong một nhóm).

### Commit Messages

-   Cố gắng tuân theo [Conventional Commits](https://www.conventionalcommits.org/) để có lịch sử commit rõ ràng và dễ quản lý (ví dụ: `feat: add symbolic calculation mode`, `fix: correct fraction simplification`, `docs: update README`).

### Linting và Formatting

-   Dự án có thể được cấu hình với ESLint và Prettier (kiểm tra `package.json` và các tệp cấu hình như `.eslintrc.json`, `.prettierrc.json`).
-   Chạy lint và format trước khi commit:
    ```bash
    pnpm lint
    pnpm format
    # hoặc các lệnh tương ứng cho npm/yarn
    ```

## Cập nhật Gói Phụ thuộc

-   Định kỳ kiểm tra và cập nhật các gói phụ thuộc để nhận các bản vá lỗi, cải thiện bảo mật và tính năng mới.
-   Sử dụng `pnpm up -i -L` (hoặc các lệnh tương ứng cho npm/yarn) để kiểm tra các bản cập nhật một cách tương tác.
-   Thận trọng khi cập nhật các gói chính (ví dụ: Next.js, React, Tailwind CSS) và kiểm tra kỹ lưỡng các thay đổi có thể gây lỗi (breaking changes).

## Xử lý Sự cố và Gỡ lỗi

-   **Công cụ Phát triển Trình duyệt:** Sử dụng React Developer Tools và các công cụ gỡ lỗi của trình duyệt để kiểm tra trạng thái thành phần, props và gỡ lỗi logic phía client.
-   **Logging:** Thêm `console.log` một cách chiến lược để theo dõi giá trị biến và luồng thực thi. Xóa hoặc vô hiệu hóa các log không cần thiết trước khi đưa lên production.
-   **Next.js Debugging:** Tham khảo tài liệu của Next.js để biết các kỹ thuật gỡ lỗi cụ thể liên quan đến render phía server, API routes, v.v.

## Các Khu vực Mã nguồn Quan trọng cần Chú ý khi Bảo trì

### 1. `components/matrix-calculator.tsx`

-   **Logic Tính toán Gauss-Jordan:**
    -   `numericGaussJordan()`: Xử lý tính toán cho ma trận số.
    -   `symbolicGaussJordan()`: Xử lý tính toán cho ma trận có tham số. Cần cẩn thận với việc phân tích và đơn giản hóa biểu thức.
    -   `formatNumber()`: Định dạng số thành chuỗi, bao gồm logic chuyển đổi sang phân số tối giản. Cần kiểm tra kỹ lưỡng các trường hợp biên.
    -   `simplifyExpression()`: Đơn giản hóa các biểu thức tham số. Đây là phần phức tạp và có thể cần cải thiện nếu có các trường hợp biểu thức mới.
-   **Quản lý Trạng thái:** Nhiều `useState` hooks quản lý trạng thái của ma trận, các bước, cài đặt hiển thị. Đảm bảo cập nhật trạng thái là bất biến (immutable).
-   **Hiển thị Ma trận và Các bước:** Logic render các ô ma trận, làm nổi bật các pivot/hàng đích, và cập nhật mô tả bước.
-   **Khả năng đáp ứng (Responsiveness):** Hàm `getMatrixCellSize` và các lớp Tailwind CSS động để điều chỉnh giao diện trên các kích thước màn hình khác nhau.

### 2. `styles/globals.css`

-   **Biến Chủ đề (Theme Variables):** Các biến CSS cho màu nền, màu chữ, v.v., cho cả chủ đề sáng và tối. Bất kỳ thay đổi màu sắc nào liên quan đến chủ đề đều cần được cập nhật ở đây.
-   **Kiểu Toàn cục:** Các kiểu áp dụng cho toàn bộ ứng dụng.

### 3. `app/layout.tsx` và `app/page.tsx`

-   **Cấu trúc Layout Chính:** `layout.tsx` định nghĩa cấu trúc HTML gốc và bao gồm `ThemeProvider`.
-   **Trang Chính:** `page.tsx` tập hợp các thành phần chính và có thể chứa logic UI cấp cao.

### 4. `tailwind.config.ts`

-   **Cấu hình Tailwind:** Mở rộng chủ đề mặc định của Tailwind (ví dụ: màu sắc, font chữ, breakpoints) nếu cần.
-   **Plugins:** Quản lý các plugin Tailwind (ví dụ: `tailwindcss-animate`).

## Triển khai (Deployment)

-   Dự án Next.js này có thể được triển khai trên nhiều nền tảng như Vercel (khuyến nghị), Netlify, AWS Amplify, hoặc server Node.js tùy chỉnh.
-   **Vercel:** Kết nối repository GitHub của bạn với Vercel để có CI/CD tự động.
-   **Biến môi trường:** Nếu có bất kỳ khóa API hoặc cấu hình nhạy cảm nào, hãy sử dụng biến môi trường (ví dụ: `.env.local`, và cấu hình chúng trên nền tảng triển khai).

## Góp ý Cải thiện

-   **Tái cấu trúc (Refactoring):** Định kỳ xem xét lại mã nguồn để tìm cơ hội tái cấu trúc, cải thiện khả năng đọc và giảm độ phức tạp, đặc biệt trong `matrix-calculator.tsx`.
-   **Kiểm thử (Testing):** Cân nhắc việc thêm các bài kiểm thử đơn vị (unit tests) cho các hàm logic quan trọng (ví dụ: `formatNumber`, `gcd`, các phần của logic Gauss-Jordan) bằng Jest hoặc Vitest. Kiểm thử end-to-end với Playwright hoặc Cypress có thể hữu ích cho việc xác minh luồng người dùng.
-   **Tài liệu:** Giữ cho `README.md` và các tài liệu khác (nếu có) được cập nhật khi có thay đổi về tính năng hoặc quy trình xây dựng.

Bằng cách tuân theo các hướng dẫn này, chúng ta có thể đảm bảo rằng dự án Gauss-Jordan Calculator vẫn dễ bảo trì, dễ mở rộng và ổn định trong thời gian dài. 