const mockData = {
  dashboard: {
    totalRevenue: '1,200,000,000đ',
    totalOrders: '5,432',
    pendingOrders: '12',
    newCustomers: '25',
  },
  products: [
    { id: 'SP001', name: 'Áo thun polo', price: '199,000đ', stock: 150, image: 'https://placehold.co/40x40/E9EAEB/5F5F60?text=SP1' },
    { id: 'SP002', name: 'Quần jeans slim-fit', price: '450,000đ', stock: 80, image: 'https://placehold.co/40x40/E9EAEB/5F5F60?text=SP2' },
    { id: 'SP003', name: 'Váy maxi hoa', price: '290,000đ', stock: 120, image: 'https://placehold.co/40x40/E9EAEB/5F5F60?text=SP3' },
    { id: 'SP004', name: 'Áo khoác bomber', price: '550,000đ', stock: 60, image: 'https://placehold.co/40x40/E9EAEB/5F5F60?text=SP4' },
  ],
  orders: [
    { id: 'DH9876', customer: 'Nguyễn Văn A', total: '450,000đ', status: 'Đang giao' },
    { id: 'DH9875', customer: 'Trần Thị B', total: '199,000đ', status: 'Đã hoàn thành' },
    { id: 'DH9874', customer: 'Phạm Văn C', total: '749,000đ', status: 'Đang xử lý' },
  ],
};


