import { NguoiDung } from "../models/nguoidung";
import * as $ from 'jquery';

export class NguoiDungServices{
    DangKy(nguoiDung:NguoiDung){
        return $.ajax({
            type:'POST',
            url:'http://sv2.myclass.vn/api/QuanLyNguoiDung/ThemNguoiDung',
            data:nguoiDung,
            ContentType:'application/json;charset=UTF-8'
        });
    };
    DangNhap(taiKhoan:string, matKhau:string){
        return $.ajax({
            type:'POST',
            url:`http://sv2.myclass.vn/api/QuanLyNguoiDung/DangNhap?taikhoan=${taiKhoan}&matkhau=${matKhau}`,
            ContentType:'application/json;charset=UTF-8'
        })
    }
}