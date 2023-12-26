# PROGRAMING LINUX BUILD
## MỤC LỤC

[A. BUILD](#build)

[1. C++ languge, Asembly language, Machine language](#build1)


[2. processor, compile, assembler, linking](#build2)

* [How C++ Works: Understanding Compilation](#build21)
* [The Build Pipeline: Preprocess, Compile, and Link:](#build22)
* [How Source Files Import and Export Symbols](#build23)

* [How Header Guards Work](#build24)

* [Pass by Value and Constness of Parameters](#build25)

* [Pass by Reference](#build26)

* [Pass by Pointer](#build27)

[B. MAKE/CMAKE](#make)

[1. Understand make process](#make1)

[C. BUID OPTIMIZATION](#opt)

[1. -O2, -O3](#opt1)

[2. Strip symbols"](#opt2)


****************************
# BUILD
<a id="build1"> </a>
##  1. C++ languge, Asembly language, Machine language

### Quy trình dịch mã từ C --> Assembely

 **B1**:  Ta có 1 file  hello.c

 trung gian: bộ tiền xử lý (C preprocessor)
 Bước này compiler sẽ expand hết macro và các pre-processor
 
 **B2**: Xử lý thành file .i
 gcc -E hello.c > hello.i //chứa code đã được expand

 trung gian: C compiler

 **B3**: biên dịch mã nguồn sang Assembly. Trong GCC bạn gõ lệnh là 
 sẽ ra được file .s là file chứa mã lệnh assembly
 gcc -S hello.i -o hello.s

 trung gian: Assembeler
 biên dịch từ assembly sang object code.
 thường biết tới tên là GAS hoặc lệnh as.

 **B4**: Tới bước này khi biên dịch xong một lần nữa ta sẽ có file
 gọi là file object chứa object code.

 trung gian: Linker Một phần mềm sẽ hỗ trợ việc làm việc này gọi là linker. 
 Bước này giúp kết nối các object file và thư viện bên ngoài thành một file thực thi được, hay một thư viện để bạn có thể đem đi chỗ khác xài.

 Nói chung khi xong bước này bạn đã có 1 file để sử dụng.
 ld -o hello.exe hello1.o hello2.o -lmath -lpthread ...

 **B5**: có 1 file hello.exe
trung gian: Loader chạy file .exe, object, module, lib

  **B6**: Process address  space

  **B7**: Primary memory e.g.RAM

### Document
[c-plus-plus-understanding-compilation](https://www.toptal.com/c-plus-plus/c-plus-plus-understanding-compilation)

[processtoolhelpapis12](https://www.installsetupconfig.com/win32programming/processtoolhelpapis12.html)

[khi-build-code-thi-complier-se-build-phan-nao-dau-tien-trong-file-c](https://daynhauhoc.com/t/khi-build-code-thi-complier-se-build-phan-nao-dau-tien-trong-file-c/72030/6)


<a id="build2"></a>
## 2. Processor, Compile, Assembler, Linking

###  How C++ Works: Understanding Compilation
<a id="build21"></a>
Tại sao Source file C++ được chia thành các Header File và Source file? Mỗi phần được trình biên dịch nhìn thấy như thế nào?

Bài viết sẽ giải thích cách trình biên dịch C++ hoạt động với một số cấu trúc ngôn ngữ cơ bản, trả lời một số câu hỏi phổ biến có liên quan đến quy trình của chúng và giúp bạn giải quyết một số lỗi liên quan mà các nhà phát triển thường mắc phải khi phát triển C++.

[Bài viết này có một số source code ví dụ có thể tải xuống](https://bitbucket.org/danielmunoz/cpp-article)


Ví dụ được biên dịch (compile) trong máy CentOS Linux:
 ```
 $ uname -sr
 
 Linux 3.10.0-327.36.3.el7.x86_64

 ```

Using g++ version:
 ```
$ g++ --version 

g++ (GCC) 4.8.5 20150623 (Red Hat 4.8.5-11)
 ```

Các Source file được cung cấp phải có khả năng di động sang các hệ điều hành khác, mặc dù các Makefile đi kèm với chúng cho quá trình xây dựng tự động chỉ có thể di động sang các hệ thống giống Unix.

<a id="build22"></a>

### The Build Pipeline: Preprocess, Compile, and Link:

Mỗi Source file C++ cần được biên dịch thành một Object file. 

Sau đó, các Object file thu được từ quá trình biên dịch nhiều Source file sẽ được liên kết thành một tệp thực thi, một thư viện dùng chung hoặc một thư viện tĩnh (tệp cuối cùng trong số này chỉ là một kho lưu trữ các Object file).

Các Source file C++ thường có hậu tố mở rộng .cpp, .cxx hoặc .cc  .

Source file C++ có thể bao gồm các tệp khác, được gọi là Header File. Header File có phần mở rộng như .h, .hpp hoặc .hxx hoặc không có phần mở rộng nào như trong thư viện chuẩn C++ và các Header File của thư viện khác (như Qt).

Bước đầu tiên mà trình biên dịch sẽ thực hiện trên Source file là chạy bộ tiền xử lý trên đó. Chỉ các Source file mới được chuyển tới trình biên dịch (để xử lý trước và biên dịch nó). Các Header File không được chuyển đến trình biên dịch. Thay vào đó, chúng được bao gồm từ các tập tin nguồn.


```
 #include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "Hello world" << std::endl;
    return 0;
}
```

Tạo preprocessed file bằng cách:

```
$ g++ -E hello-world.cpp -o hello-world.ii
```
Tùy chọn -E có thể được chuyển tới trình biên dịch g++

Cùng với tùy chọn -o để chỉ định tên mong muốn của Source file được xử lý trước.

Xem số dòng thực thi: 

```
$ wc -l hello-world.ii 
17558 hello-world.ii
```

> #### Chúng ta có thể thấy rằng trình biên dịch phải biên dịch một tệp lớn hơn nhiều so với Source file đơn giản mà chúng ta thấy. Điều này là do các Header file Và trong ví dụ, ta chỉ đưa vào một Header file. Và nếu số lượng Header file càng lớn trình dịch càng mất thời gian.

-> Quá trình tiền xử lý và biên dịch này tương tự như ngôn ngữ C. Nó tuân theo các quy tắc C để biên dịch và  bao gồm các Header file và tạo Object code gần như giống nhau.

### How Source Files Import and Export Symbols

<a id="build23"></a>


**Ví dụ**: Có 1 source file tên sum.c 

Gồm 2 functions: tính tổng số nguyên, tính tổng số thực.
```
int sumI(int a, int b) {
    return a + b;
}

float sumF(float a, float b) {
    return a + b;
}
```
Biên dịch nó (hoặc chạy make và tất cả các bước để tạo hai ứng dụng mẫu sẽ được thực thi) 

Tạo Object file sum.o:

```
$ gcc -c sum.c
```
Bây giờ hãy xem các ký hiệu được xuất và nhập bởi Object file này:
```
$ nm sum.o
0000000000000014 T sumF
0000000000000000 T sumI
```
Không có ký hiệu nào được nhập.

Hai ký hiệu được xuất: **sumF** và **sumI**. 

Các ký hiệu đó được xuất dưới dạng một phần của đoạn .text (T), vì vậy chúng là tên hàm, mã thực thi.

Nếu các tệp nguồn khác (cả C hoặc C++) muốn gọi các hàm đó, chúng cần khai báo chúng trước khi gọi.

Cách chính xác để gọi các hàm trên là tạo một Header file khai báo chúng và đưa chúng vào bất kỳ tệp nguồn nào mà chúng ta muốn gọi chúng. Header file có thể có bất kỳ name hoặc extension nào. 

Tạo file sum.h:
```
#ifdef __cplusplus
extern "C" {
#endif

int sumI(int a, int b);
float sumF(float a, float b);

#ifdef __cplusplus
} // end extern "C"
#endif
```

Các khối biên dịch có điều kiện ifdef/endif đó là gì? Nếu  bao gồm header này từ tệp nguồn C tập lệnh trên trở thành:
```
int sumI(int a, int b);
float sumF(float a, float b);

```
Nhưng nếu đưa vào source file C++:

```
extern "C" {

int sumI(int a, int b);
float sumF(float a, float b);

} // end extern "C"
```

Ngôn ngữ C không biết gì về lệnh "C" bên ngoài, nhưng C++ thì có và nó áp dụng lệnh này cho các khai báo hàm C. 

Điều này là do tên hàm (và phương thức) của C++ mangles vì ​​nó hỗ trợ **nạp chồng hàm/phương thức**, trong khi C thì không.

```
#include <iostream> // std::cout, std::endl
#include "sum.h" // sumI, sumF

void printSum(int a, int b) {
    std::cout << a << " + " << b << " = " << sumI(a, b) << std::endl;
}

void printSum(float a, float b) {
    std::cout << a << " + " << b << " = " << sumF(a, b) << std::endl;
}

extern "C" void printSumInt(int a, int b) {
    printSum(a, b);
}

extern "C" void printSumFloat(float a, float b) {
    printSum(a, b);
}

```

> #### Có hai hàm có cùng tên (printSum) chỉ khác nhau về kiểu tham số: int hoặc float. [Nạp chồng hàm](https://en.wikipedia.org/wiki/Function_overloading) là một tính năng của C++ không có trong C.

Để triển khai tính năng này và phân biệt các hàm đó, C++ xáo trộn tên hàm, như chúng ta có thể thấy trong tên ký hiệu được xuất của chúng.

```
$ g++ -c print.cpp
$ nm print.o 
0000000000000132 T printSumFloat
0000000000000113 T printSumInt
                 U sumF
                 U sumI
0000000000000074 T _Z8printSumff
0000000000000000 T _Z8printSumii
                 U _ZSt4cout
```
Các hàm đó được xuất (trong hệ thống của tôi) dưới dạng _Z8printSumff cho phiên bản float và _Z8printSumii cho phiên bản int. Mọi tên hàm trong C++ đều bị đọc sai trừ khi được khai báo là "C" bên ngoài.

 Có hai hàm được khai báo bằng liên kết C trong print.cpp: printSumInt và printSumFloat.

Bây giờ chúng ta hãy xem print.hpp, một Header file có thể được bao gồm cả từ các Source file C hoặc C++, điều này sẽ cho phép printSumInt và printSumFloat được gọi từ cả C và từ C++, và printSum được gọi từ C++:

```
#ifdef __cplusplus
void printSum(int a, int b);
void printSum(float a, float b);
extern "C" {
#endif

void printSumInt(int a, int b);
void printSumFloat(float a, float b);

#ifdef __cplusplus
} // end extern "C"
#endif
```
Nếu chúng tôi đưa nó từ Source file C:


```
void printSumInt(int a, int b);
void printSumFloat(float a, float b);
```


Nếu chúng tôi bao gồm print.hpp từ tệp nguồn C++, __cplusplus preprocessor macro sẽ được xác định và tệp sẽ được xem là:

```
void printSum(int a, int b);
void printSum(float a, float b);
extern "C" {

void printSumInt(int a, int b);
void printSumFloat(float a, float b);

} // end extern "C"
```

### So sánh Header file iostream và Header file tự build:


Ở phần [The Build Pipeline: Preprocess, Compile, and Link](#build22)
Tạo preprocessed file bằng cách:

```
 g++ -E hello-world.cpp -o hello-world.ii
```

Và vừa rồi ta học được cách tạo 1 Header File 

```
gcc -E c-main.c -o c-main.ii
```
So sánh 2 file c-main.ii và hello-world.ii ta thấy được số lệnh thực thi file c-main.ii ít hơn rất nhiệu.

### How Header Guards Work

<a id="build24"></a>



Header guard (hay còn gọi là inlcude guard) là một phương pháp cực kì đơn giản để tránh việc include header file 2 lần trong một file source.

Trường hợp bạn lỡ khai báo 2 lần header trong 1 soucre file , trực tiếp hoặc gián tiếp.

Nhưng vì 1 header có thể bao gồm các header khác, nên cùng 1 header có thể gọi lại nhiều lần. Và vì nội dung header chỉ được chèn vào vị trí bao gồm nó, nên dễ dàng kết thúc với các tuyên bố trùng lặp.

Tạo 2 file
File unguarded.hpp  

```
// unguarded.hpp
class A {
public:
    A(int a) : m_a(a) {}
    void setA(int a) { m_a = a; }
    int getA() const { return m_a; }
private:
    int m_a;
};

```
Và file guarded.hp

```
// guarded.hpp:
#ifndef __GUARDED_HPP
#define __GUARDED_HPP

class A {
public:
    A(int a) : m_a(a) {}
    void setA(int a) { m_a = a; }
    int getA() const { return m_a; }
private:
    int m_a;
};

#endif // __GUARDED_HPP
```

Sự khác biệt là, trong Guarded.hpp, bọc  toàn bộ header trong một điều kiện sẽ chỉ được đưa vào nếu macro tiền xử lý __GUARDED_HPP không được xác định.

Tạo file main-guarded.cpp với  guarded.hpp được khai báo 2 lần:
```
#include "guarded.hpp"
#include "guarded.hpp"

int main(int argc, char* argv[]) {
    A a(5);
    a.setA(0);
    return a.getA();
}
```
Nhưng preprocessed output không có lỗi:
```
g++ -E main-guarded.cpp 
# 1 "main-guarded.cpp"
# 1 "<built-in>"
# 1 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4
# 1 "<command-line>" 2
# 1 "main-guarded.cpp"
# 1 "guarded.hpp" 1



class A {
public:
    A(int a) : m_a(a) {}
    void setA(int a) { m_a = a; }
    int getA() const { return m_a; }
private:
    int m_a;
};
# 2 "main-guarded.cpp" 2


int main(int argc, char* argv[]) {
    A a(5);
    a.setA(0);
    return a.getA();
}
```
Do đó, nó có thể được biên dịch mà không gặp vấn đề gì:
```
g++ -o guarded main-guarded.cpp
```
Nhưng nếu build Object file với unguarded:
```
 g++ -o unguarded main-unguarded.cpp 
```
Lỗi khai báo xuất hiện:
```
unguarded.hpp:1:7: error: redefinition of 'class A'
 class A {
       ^
In file included from main-unguarded.cpp:1:0:
unguarded.hpp:1:7: error: previous definition of 'class A'
 class A {
```

### Pass by Value and Constness of Parameters

<a id="build25"></a>

`Pass-by-value` được hiểu là khi bạn thay đổi biến trong hàm thì ngoài hàm sẽ không bị ảnh hưởng. Nó giống như bạn copy giá trị của biến vào biến khác rồi truyền vào hàm.

Vì tôi sử dụng lệnh `using namespace std`, nên tôi không cần phải xác định tên của các ký hiệu (hàm hoặc lớp) bên trong không gian tên std trong phần còn lại của đơn vị dịch thuật, trong trường hợp của tôi là phần còn lại của tệp nguồn.

 Nếu đây là một Header file, không nên chèn lệnh này vì Header file được cho là được đưa vào từ nhiều Source file.
 
 Lưu ý cách một số tham số là const. Điều này có nghĩa là chúng ta không thể thay đổi chúng trong phần nội dung của hàm nếu chúng ta cố gắng làm vậy. Nó sẽ báo lỗi biên dịch. Ngoài ra, hãy lưu ý rằng tất cả các tham số trong tệp nguồn này được truyền theo giá trị, không phải theo tham chiếu (&) hoặc theo con trỏ (*).

 Vì việc khai báo hàm như những gì người gọi thấy không quan trọng, nên chúng ta có thể tạo tiêu đề by-value.hpp như thế này:
```
 #include <vector>

int sum(int a, int b);
float sum(float a, float b);
int sum(std::vector<int> v);
int sum(std::vector<float> v);
```
Việc thêm các từ hạn định const ở đây được cho phép (thậm chí bạn có thể đủ điều kiện là các biến const không có trong định nghĩa và nó sẽ hoạt động), nhưng điều này là không cần thiết và nó sẽ chỉ khiến các khai báo dài dòng.

### Pass by Reference

<a id="build6"> </a>

`Pass-by-reference` là khi bạn thay đổi biến trong hàm cũng làm ngoài hàm bị ảnh hưởng. Nó giống như bạn truyền đúng địa chỉ của biến đó vào hàm.

Xem file by-reference.cpp sau đây:

```
#include <vector>
#include <iostream>
#include <numeric>

using namespace std;

int sum(const int& a, int& b) {
    cout << "sum(const int&, int&)" << endl;
    const int c = a + b;
    ++b; // Will modify caller variable
    // ++a; // Not allowed, but would also modify caller variable
    return c;
}

float sum(float& a, const float& b) {
    cout << "sum(float&, const float&)" << endl;
    return a + b;
}

int sum(const std::vector<int>& v) {
    cout << "sum(const std::vector<int>&)" << endl;
    return accumulate(v.begin(), v.end(), 0);
}

float sum(const std::vector<float>& v) {
    cout << "sum(const std::vector<float>&)" << endl;
    return accumulate(v.begin(), v.end(), 0.0f);
}
```

Hằng số khi passing by reference vấn đề khi được gọi, bởi vì nó sẽ cho caller biết liệu đối số của nó có được caller sửa đổi hay không. Do đó, các ký hiệu được xuất với hằng số của chúng:
```
$ g++ -c by-reference.cpp
$ nm -C by-reference.o
0000000000000051 T sum(float&, float const&)
0000000000000000 T sum(int const&, int&)
00000000000000fe T sum(std::vector<float, std::allocator<float> > const&)
00000000000000a3 T sum(std::vector<int, std::allocator<int> > const&)
```

Header:
```
#include <vector>

int sum(const int&, int&);
float sum(float&, const float&);
int sum(const std::vector<int>&);
float sum(const std::vector<float>&);
```

> #### C luôn truyền theo giá trị (pass-by-value).  C++ có thể truyền theo giá trị (pass-by-value) hoặc truyền theo tham chiếu (pass-by-reference).

### Pass by Pointer
<a id="build7"> </a>

```
// by-pointer.cpp:
#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int sum(int const * a, int const * const b) {
    cout << "sum(int const *, int const * const)" << endl;
    const int c = *a+ *b;
    // *a = 4; // Can't change. The value pointed to is const.
    // *b = 4; // Can't change. The value pointed to is const.
    a = b; // I can make a point to another const int 
    // b = a; // Can't change where b points because the pointer itself is const.
    return c;
}

float sum(float * const a, float * b) {
    cout << "sum(int const * const, float const *)" << endl;
    return *a + *b;
}

int sum(const std::vector<int>* v) {
    cout << "sum(std::vector<int> const *)" << endl;
    // v->clear(); // I can't modify the const object pointed by v
    const int c = accumulate(v->begin(), v->end(), 0);
    v = NULL; // I can make v point to somewhere else
    return c;
}

float sum(const std::vector<float> * const v) {
    cout << "sum(std::vector<float> const * const)" << endl;
    // v->clear(); // I can't modify the const object pointed by v
    // v = NULL; // I can't modify where the pointer points to
    return accumulate(v->begin(), v->end(), 0.0f);
}
```