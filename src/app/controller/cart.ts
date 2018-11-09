import '../../assets/css/cart.css';
import { Phim } from '../models/phim';

let danhSachGioHang:Phim[] = [];
// ---FUN Get LOCALSTORAGE---
let layLocal = function (){
    let data = JSON.parse(localStorage.getItem('cartList'));
    console.log(data)
    return data != null ? data : [];
};

window.onload = function () {
    danhSachGioHang = layLocal();
    taoBang();
};

let taoBang = () => {
    let content = ``;
    for(let i in danhSachGioHang){
        let {TenPhim, NgayKhoiChieu, HinhAnh, DanhGia, MaPhim} = danhSachGioHang[i];
        content +=`
            <tr>
                <td>${parseInt(i)+1}</td>
                <td>${TenPhim}</td>
                <td><img src=${HinhAnh} style="width:100px; height:150px;" /></td>
                <td>${DanhGia}</td>
                <td>${NgayKhoiChieu}</td>
                <td>
                    <button data-maphim="${MaPhim}" class="btn btn-danger btnXoa">Xóa</button>
                </td>
            </tr>
        `

    }
    (<HTMLTableElement>document.getElementById('tBodyContent')).innerHTML = content;
    xoaPhim('btnXoa')
}

let xoaPhim = (btnClass:string) => {
    let btns:any = <HTMLCollection>document.getElementsByClassName(btnClass);
    for(let btn of btns){
        btn.addEventListener('click', () => {
            let maPhim = btn.getAttribute('data-maphim');
            let index = timPhimTheoMa(danhSachGioHang, maPhim);
            if(index != -1){
                danhSachGioHang.splice(index, 1);
            }
            localStorage.setItem('cartList', JSON.stringify(danhSachGioHang));
            taoBang();
        })
    }
}

let timPhimTheoMa = (movieArr:Phim[], maPhim:string) => {
    for(let i in movieArr){
        if(movieArr[i].MaPhim === maPhim){
            return parseInt(i);
        }
    }
    return -1;
}