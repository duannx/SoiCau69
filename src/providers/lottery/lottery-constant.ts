import { Injectable } from '@angular/core';
/**Những hằng số chung giữa client và server, những thông số này sẽ không thay đổi, phục vụ xây dựng view tốt hơn. */
@Injectable()
export class LotteryConstants {
	/** Các loại xổ số */
	public XSMB: number = 1;
	public XSMT: number = 2;
	public XSMN: number = 3;
	public VIETLOTT: number = 4;

	/** Cate_id các loại xổ số miền Bắc */
	public RESULTXSMB: number = 1;
	public XSDT123: number = 2;
	public XSDT636: number = 3;
	public TT: number = 4;

	/** Cate_id và ngày quay các loại xổ số miền Trung */
	public CITIESMT = [
		{
			id: 5,
			available_day: [4],
			title: "Bình Định"
		}, {
			id: 6,
			available_day: [3, 6],
			title: "Đà Nẵng",
		},
		{
			id: 7,
			available_day: [2],
			title: "Đắc Lắc"
		},
		{
			id: 8,
			available_day: [6],
			title: "Đắc Nông"
		},
		{
			id: 9,
			available_day: [5],
			title: "Gia Lai"
		},
		{
			id: 10,
			available_day: [0, 3],
			title: "Khánh Hòa"
		},
		{
			id: 11,
			available_day: [0],
			title: "Kon Tum"
		},
		{
			id: 12,
			available_day: [5],
			title: "Ninh Thuận"
		},
		{
			id: 13,
			available_day: [1],
			title: "Phú Yên"
		},
		{
			id: 14,
			available_day: [4],
			title: "Quảng Bình"
		},
		{
			id: 15,
			available_day: [2],
			title: "Quảng Nam"
		},
		{
			id: 16,
			available_day: [6],
			title: "Quảng Ngãi"
		},
		{
			id: 17,
			available_day: [4],
			title: "Quảng Trị"
		},
		{
			id: 18,
			available_day: [1],
			title: "Thừa Thiên Huế"
		}
	];

	/** Cate_id và ngày quay các loại xổ số miền Nam */
	public CITIESMN = [
		{
			id: 19,
			available_day: [4],
			title: "An Giang"
		},
		{
			id: 20,
			available_day: [2],
			title: "Bạc Liêu"
		},
		{
			id: 21,
			available_day: [2],
			title: "Bến Tre"
		},
		{
			id: 22,
			available_day: [5],
			title: "Bình Dương"
		},
		{
			id: 23,
			available_day: [6],
			title: "Bình Phước"
		},
		{
			id: 24,
			available_day: [4],
			title: "Bình Thuận"
		},
		{
			id: 25,
			available_day: [1],
			title: "Cà Mau"
		},
		{
			id: 26,
			available_day: [3],
			title: "Cần Thơ"
		},
		{
			id: 27,
			available_day: [0],
			title: "Đà Lạt"
		},
		{
			id: 28,
			available_day: [3],
			title: "Đồng Nai"
		},
		{
			id: 29,
			available_day: [1],
			title: "Đồng Tháp"
		},
		{
			id: 30,
			available_day: [6],
			title: "Hậu Giang"
		},
		{
			id: 31,
			available_day: [1, 6],
			title: "Tp. Hồ Chí Minh"
		},
		{
			id: 32,
			available_day: [0],
			title: "Kiên Giang"
		},
		{
			id: 33,
			available_day: [6],
			title: "Long An"
		},
		{
			id: 34,
			available_day: [3],
			title: "Sóc Trăng"
		},
		{
			id: 35,
			available_day: [4],
			title: "Tây Ninh"
		},
		{
			id: 36,
			available_day: [0],
			title: "Tiền Giang"
		},
		{
			id: 37,
			available_day: [5],
			title: "Trà Vinh"
		},
		{
			id: 38,
			available_day: [5],
			title: "Vĩnh Long"
		},
		{
			id: 39,
			available_day: [2],
			title: "Vũng Tàu"
		}
	]


	public DAY_IN_MILLISECONDS: number = 86400000;

}


