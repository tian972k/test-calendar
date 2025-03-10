
# 🗓️ Report Task :

## 1. Cấu trúc dữ liệu đề xuất

Dữ liệu từ backend sẽ được tổ chức thành một danh sách JSON chứa các sự kiện (`EventCalendar[]`), mỗi sự kiện có thông tin chi tiết:

```typescript
export type EventType = "appointment" | "event" | "recurring-event" | "holiday";

export type EventMeeting = {
  link: string;
};

export type EventClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export type RecurrenceRule = {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  interval: number;
  until?: Date;
  byweekday?: number[]; // Chỉ định ngày trong tuần (0 = CN, 1 = T2, ...)
};

export type EventCalendar = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  type: EventType;
  editable: boolean;
  meeting?: EventMeeting | null;
  client?: EventClient;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  recurrence?: RecurrenceRule | null;
};
```

## 🔹  JSON Data Backend trả về 

```json
[
  {
    "id": "1",
    "title": "Meeting with John",
    "description": "Discuss project details",
    "start": "2025-03-10T09:00:00.000Z",
    "end": "2025-03-10T10:00:00.000Z",
    "type": "appointment",
    "editable": true,
    "meeting": { "link": "https://zoom.us/meeting/123" },
    "client": {
      "id": "c1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  {
    "id": "2",
    "title": "Weekly Standup Meeting",
    "start": "2025-03-11T10:00:00.000Z",
    "end": "2025-03-11T11:00:00.000Z",
    "type": "recurring-event",
    "editable": false,
    "recurrence": {
      "frequency": "WEEKLY",
      "interval": 1,
      "byweekday": [1, 3, 5]
    }
  },
//   ... more events
  "total": 100, 
  "limit": 10, 
  "offset": 0,
]
```
## Giải thích lựa chọn

###  **Dữ liệu kiểu `EventCalendar[]`**
- Dễ dàng hiển thị trên lịch với danh sách sự kiện.
- Hỗ trợ nhiều loại sự kiện như:
  - `appointment` (Cuộc hẹn với khách hàng)
  - `event` (Sự kiện chung, hội thảo)
  - `recurring-event` (Sự kiện lặp lại)
  - `holiday` (Ngày nghỉ lễ)

###  **Trường `recurrence`**
- Xác định sự kiện lặp lại theo các tần suất:
  - **`DAILY`** (Hàng ngày)
  - **`WEEKLY`** (Hàng tuần)
  - **`MONTHLY`** (Hàng tháng)
- Các thuộc tính quan trọng:
  - `interval`: Khoảng cách giữa các lần lặp.
  - `until`: Ngày kết thúc (nếu có).
  - `byweekday`: Chỉ định các ngày trong tuần (VD: [1,3,5] cho thứ Hai, Tư, Sáu).

###  **Trường `client`**
- Lưu thông tin khách hàng liên quan đến cuộc hẹn:
  - **`id`**: Mã khách hàng.
  - **`name`**: Tên khách hàng.
  - **`email`**: Email liên hệ.
  - **`phone`**: Số điện thoại.
  - **`avatar`**: Ảnh đại diện.

### **Trường `meeting`**
- Chứa đường dẫn cuộc họp online nếu có, giúp người dùng dễ dàng tham gia sự kiện trực tuyến.

### **Trường màu sắc (`color`, `backgroundColor`, `textColor`, `borderColor`)**
- Dùng để cá nhân hóa giao diện lịch, giúp người dùng dễ phân biệt các loại sự kiện khác nhau.


###  **Lưu ý khi Backend trả về JSON** 
#### **Lọc dữ liệu theo ngày (`min-date`, `max-date`)** 
- Để giảm tải dữ liệu không cần thiết, backend nên hỗ trợ lọc theo ngày: 
	 - `min-date`: Ngày bắt đầu tối thiểu của sự kiện cần truy vấn. 
	 - `max-date`: Ngày kết thúc tối đa của sự kiện cần truy vấn. 
	- Ví dụ truy vấn: 
	```http GET /events?min-date=2025-03-01&max-date=2025-03-31```
#### Các date time phải trả theo ISO 8601.
#### Phân trang theo offset limit để giảm tải dữ liệu get về.

## 2. Handle **Recurring event** 
#### Đã sử dụng thư viện [\[rrule\]](https://www.npmjs.com/package/rrule) để handle tính năng recurring event.
## 3. Public url :
link git : https://github.com/tian972k/test-calendar
link demo :  https://test-calendar-beta.vercel.app
## 4. Let us know what you have learned from this project :
 Em đã học được cách xử lý các thư viện về calendar và implement phần recurring event , học thêm được kiến thức về việc sử dụng google calendar api.
 
 ## 5. Let us know if you can continue to develop this project, and what will you work on.These could be concepts that you’re still not completely done with or some features that you think could make this layout better.
 Một số tính năng e sẽ phát triển nếu em được tiếp tục phát triển dự án :
 - Tính năng đa ngôn ngữ.
 - Đăng nhập đăng ký bằng google để có thể sử dụng lịch cá nhân.
 - Tích hợp và đồng bộ event từ google calendar cá nhân ( có thể thêm , sửa xoá sự kiện).
 - Gửi email tới mỗi khi sự kiện bắt đầu.
 - Thêm dark mode.