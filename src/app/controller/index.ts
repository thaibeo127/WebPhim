import '../../assets/css/index.css';
import { PhimServices } from '../services/phimSV';
import { Phim } from '../models/phim';
import { NguoiDung } from '../models/nguoidung';
import { NguoiDungServices } from '../services/nguoidungSV';
import swal from 'sweetalert2';

//---Khởi tạo Instance từ lớp PhimServices---
const PhimSV = new PhimServices();
let danhSachPhim: Phim[] = [];
let danhSachGioHang: Phim[] = []
let nguoiDungServices = new NguoiDungServices();
//---hàm chạy ngay sau khi load xong trang---
window.onload = function () {
    PhimSV.layDanhSachPhim().done(function (res) {
        console.log(res)
        danhSachPhim = res;
        renderMovieItem();
    }).fail(function (error) {
        console.log(error);
    })
};

let renderMovieItem = () => {
    let content: string = '';
    for (let movie of danhSachPhim) {
        //destructering
        let {MaPhim, TenPhim, Trailer, HinhAnh, MoTa, MaNhom, NgayKhoiChieu, DanhGia} = movie;
        content += `
            <div class="col-sm-6 col-md-3 text-center">                
                <div class="movie__item">
                    <img src="${HinhAnh}" onerror="this.onerror===null;this.src='https://a.wattpad.com/cover/150635032-352-k234728.jpg'" style="height:350px" class="img-fluid w-100">
                    <div class="movie__overlay"></div>
                     <div class="movie__detail w-100 text-center text-white">
                        <i class="fa fa-play d-block mx-auto mb-3 video-play venobox vbox-item" href="https://youtu.be/aOXvyd9v1cg" data-vbtype="video"></i>
                        <p>
                            <a class="movie__icon video-play"> <i class="fa fa-file"></i></a>
                            <a 
                                data-maphim=${MaPhim}
                                data-tenphim=${TenPhim}
                                data-trailer=${Trailer}
                                data-hinhanh=${HinhAnh}
                                data-mota=${MoTa}
                                data-manhom=${MaNhom}
                                data-ngaykhoichieu=${NgayKhoiChieu}
                                data-danhgia=${DanhGia}
                                class="movie__icon video-play btnAddToCart"> <i class="fa fa-cart-plus"></i></a>
                        </p>
                        <span>Released: ${NgayKhoiChieu ? NgayKhoiChieu.substr(0, 10) : '06.11.2018'}</span>
                    </div>
                </div>
                <p class="movie__name text-center my-3">${TenPhim}</p>
                ${renderStar(parseInt(DanhGia))}
            </div>
            `
    }
    (<HTMLDivElement>document.getElementById('movieList')).innerHTML = content;
    themVaoGioHang('btnAddToCart');
};

let renderStar = (num: number) => {
    let stars = ``;
    if (num) {
        for (let i = 0; i < num; i++) {
            stars += `<i class="fa fa-star movie__star"></i>`
        }
        for (let k = 5; k > num; k--) {
            stars += `<i class="fa fa-star-o movie__star"></i>`
        }
    } else {
        for (let i = 0; i < 5; i++) {
            stars += `<i class="fa fa-star movie__star"></i>`
        }
    }
    return stars;
}

let themVaoGioHang = (btnClass) => {
    let btns: any = <HTMLCollection>document.getElementsByClassName(btnClass);
    for (let btn of btns) {
        btn.addEventListener('click', () => {
            let maPhim = btn.getAttribute('data-maphim');
            let tenPhim = btn.getAttribute('data-tenphim');
            let trailer = btn.getAttribute('data-trailer');
            let hinhAnh = btn.getAttribute('data-hinhanh');
            let moTa = btn.getAttribute('data-mota');
            let maNhom = btn.getAttribute('data-manhom');
            let ngayKhoiChieu = btn.getAttribute('data-ngaykhoichieu');
            let danhGia = btn.getAttribute('data-danhgia');

            let PhimItem = new Phim(maPhim, tenPhim, trailer, hinhAnh, moTa, maNhom, ngayKhoiChieu, danhGia);
            //kiểm tra sản phẩm đã có trong giỏ chưa
            let index = timPhimTheoMa(PhimItem.MaPhim);
            if(index === -1){
                //Spread operator
            danhSachGioHang = [...danhSachGioHang,PhimItem];
            }
            localStorage.setItem('cartList', JSON.stringify(danhSachGioHang));
            (<HTMLSpanElement>document.getElementById('totalAmount')).innerHTML = danhSachGioHang.length.toString();
        })
    }
}

let timPhimTheoMa = (maPhim:string) => {
    for(let movie of danhSachGioHang){
        if(movie.MaPhim === maPhim){
            return 1;
        }
    }
    return -1;
}

//---Đăng Ký---
let dangKy = ()=>{
    let taiKhoan = (<HTMLInputElement>document.getElementById('TaiKhoan')).value;
    let matKhau = (<HTMLInputElement>document.getElementById('MatKhau')).value;
    let hoTen = (<HTMLInputElement>document.getElementById('HoTen')).value;
    let email = (<HTMLInputElement>document.getElementById('Email')).value;
    let soDT = (<HTMLInputElement>document.getElementById('SoDienThoai')).value;
    let maNhom = 'GP01';
    let maLoaiNguoiDung = 'KhachHang';
    let nguoiDungMoi = new NguoiDung (taiKhoan, matKhau, email, soDT, maNhom, maLoaiNguoiDung, hoTen);
    
    let ajaxDangKy = nguoiDungServices.DangKy(nguoiDungMoi);
    ajaxDangKy.done(res=>{
        if(typeof(res) !== 'string'){
            alert('Success');
            (<HTMLButtonElement>document.getElementById('btnCloseDangKy')).click();
        }
    }).fail(error=>{
        console.log(error);
    })
}
(<HTMLButtonElement>document.getElementById('btnDangKy')).addEventListener('click', dangKy);

//---Đăng Nhập---
let dangNhap = ()=>{
    let taiKhoan = (<HTMLInputElement>document.getElementById('TaiKhoanDangNhap')).value;
    let matKhau = (<HTMLInputElement>document.getElementById('MatKhauDangNhap')).value;

    nguoiDungServices.DangNhap(taiKhoan, matKhau).done(res => {
        if(typeof(res) !== 'string'){
            alert('Success');
            (<HTMLButtonElement>document.getElementById('btnCloseDangNhap')).click();
            (<HTMLSpanElement>document.getElementById('tkDangNhap')).innerHTML = `Xin chào <b>${taiKhoan}</b>!`;
            localStorage.setItem("TK", JSON.stringify(taiKhoan));
        }
    }).fail(error => {
        console.log(error);
    })
}
(<HTMLButtonElement>document.getElementById('btnDangNhap')).addEventListener('click', dangNhap);

//---Lấy Local TK đã đăng nhập---
let getLocal = ()=>{
    var dataTK = JSON.parse(localStorage.getItem("TK"));
    if (dataTK != null){
        (<HTMLSpanElement>document.getElementById('tkDangNhap')).innerHTML = `Xin chào <b>${dataTK}</b>!`;
    };
}
getLocal();

//---Sign Out---
let signOut = ()=>{
    
}