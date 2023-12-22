//*Document
//https://www.toptal.com/c-plus-plus/c-plus-plus-understanding-compilation
//https://www.installsetupconfig.com/win32programming/processtoolhelpapis12.html

// *Quy trình dịch mã từ C -> Assembely
/**
//  * B1:  Ta có 1 file  hello.c
 * 
 * trung gian: bộ tiền xử lý (C preprocessor)
 * Bước này compiler sẽ expand hết macro và các pre-processor
 * 
//  * B2: Xử lý thành file .i
 * gcc -E hello.c > hello.i //chứa code đã được expand
 * 
 * trung gian: C compiler
 * 
 * 
//  * B3: biên dịch mã nguồn sang Assembly. Trong GCC bạn gõ lệnh là 
 * sẽ ra được file .s là file chứa mã lệnh assembly
* gcc -S hello.i -o hello.s
 * 
 * trung gian: Assembeler
 * biên dịch từ assembly sang object code.
 * thường biết tới tên là GAS hoặc lệnh as.
 * 
//  * B4: Tới bước này khi biên dịch xong một lần nữa ta sẽ có file
//  * gọi là file object chứa object code.
 * 
 * trung gian: Linker Một phần mềm sẽ hỗ trợ việc làm việc này gọi là linker. 
 * Bước này giúp kết nối các object file và thư viện bên ngoài thành một file thực thi được, hay một thư viện để bạn có thể đem đi chỗ khác xài.
 * Nói chung khi xong bước này bạn đã có 1 file để sử dụng.
 * 
 * ld -o hello.exe hello1.o hello2.o -lmath -lpthread ...
 *
 * * B5: có 1 file hello.exe
 *
 *trung gian: Loader chạy file .exe, object, module, lib
 * 
 * *B6: Process address  space
 *
 *
 *
 * *B7: Primary memory e.g.RAM
 *
 *
 *
 * *
 *
 *
 *
 * *
 *
 *
 *
 * *
 *
 *
 *
 * *
 *
 *
 *
 *
 **/
