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

 **B3**: biên dịch source code sang Assembly. Trong GCC bạn gõ lệnh là 
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
**Vì sao lại có _Z8printSumff, _Z8printSumii , _ZSt4cout ?**

C++ có hỗ trợ overload, tức là có thể có 2 functions chung 1 name.
2 function này cùng tên, khác params thôi.
Như vậy những ngôn ngữ như C++ nó phải tìm ra cách để phân biệt 2 hàm cùng name nhưng khác
params.

Để phân biệt được như vậy thì khi biên dịch ra, C++ sẽ đổi tên hàm lại._Z8printSumff --> chính là symbol

Và  preprocessed file  (đuôi .ii) gom hết header vào 1 file. " Nhưng vì 1 header có thể bao gồm các header khác, nên cùng 1 header có thể gọi lại nhiều lần. Và vì nội dung header chỉ được chèn vào vị trí bao gồm nó, nên dễ dàng kết thúc với các tuyên bố trùng lặp. "  

Các chương trình biên dịch nó khong có khả năng liên kết các file
nên khi biên dịch, nó sẽ gom tất cả các file lại làm một file .ii
Bước preprocessor sẽ copy tất cả các file trong include, bỏ toàn bộ vào trong 1 file. 

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



Header guard (hay còn gọi là inlcude guard) là một phương pháp cực kì đơn giản để tránh việc include header file nhiều lần trong một file source.

Trường hợp bạn lỡ khai báo nhiều lần header trong 1 soucre file , trực tiếp hoặc gián tiếp.

Nhưng vì 1 header có thể bao gồm các header khác, nên cùng 1 header có thể gọi lại nhiều lần. Và vì nội dung header chỉ được chèn vào vị trí bao gồm nó, nên dễ dàng kết thúc với các tuyên bố trùng lặp.

Cách giải quyết là ở  1 file luôn có dòng này:
ví dụ: 

#ifndef HOANG_PHAM_H
#define HOANG_PHAM_H
#endif

hoặc

#ifndef QUANG_LE
#define QUANG_LE
#endif

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
 
 Lưu ý cách một số tham số là const. Điều này có nghĩa là chúng ta không thể thay đổi chúng trong phần nội dung của hàm nếu chúng ta cố gắng làm vậy. Nó sẽ báo lỗi biên dịch. **Ngoài ra, hãy lưu ý rằng tất cả các tham số trong tệp nguồn này được truyền theo giá trị, không phải theo tham chiếu (&) hoặc theo con trỏ (*).**

 Vì việc khai báo hàm như những gì người gọi thấy không quan trọng, nên chúng ta có thể tạo tiêu đề by-value.hpp như thế này:
```
 #include <vector>

int sum(int a, int b);
float sum(float a, float b);
int sum(std::vector<int> v);
int sum(std::vector<float> v);
```
Việc thêm các từ hạn định const ở đây được cho phép (thậm chí bạn có thể đủ điều kiện là các biến const không có trong định nghĩa và nó sẽ hoạt động), nhưng điều này là không cần thiết và nó sẽ chỉ khiến các khai báo dài dòng.


#### Constness of Parameters
    const type name = value;


Sử dụng từ khóa const với biến, coder sẽ không cần quan tâm tới việc thay đổi giá trị của biến nên sẽ rất dễ dàng trong việc sử dụng giá trị mà không cần quan tâm tại một vị trí nào đó, sẽ có người thay đổi giá trị của biến.

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
Để khai báo một con trỏ tới phần tử const (int trong ví dụ), bạn có thể khai báo kiểu như sau:

```
int const *
const int *
```
Nếu bạn cũng muốn bản thân con trỏ là const, nghĩa là con trỏ không thể thay đổi để trỏ đến một thứ khác, bạn thêm một const sau dấu sao:
```
int const * const
const int * const
```
Nếu bạn muốn con trỏ là const, nhưng không phải là phần tử được nó trỏ:

```
int * const

```
So sánh các function signatures với việc kiểm tra đã được giải mã của Object file:
```
$ g++ -c by-pointer.cpp
$ nm -C by-pointer.o
000000000000004a T sum(float*, float*)
0000000000000000 T sum(int const*, int const*)
0000000000000105 T sum(std::vector<float, std::allocator<float> > const*)
000000000000009c T sum(std::vector<int, std::allocator<int> > const*)
```

Cú pháp nm sử dụng ký hiệu đầu tiên (const sau loại). Ngoài ra, hãy lưu ý rằng hằng số duy nhất được xuất và quan trọng đối với người gọi là liệu hàm có sửa đổi phần tử được trỏ bởi con trỏ hay không. Hằng số của chính con trỏ không liên quan đến người gọi vì bản thân con trỏ luôn được truyền dưới dạng bản sao. Hàm chỉ có thể tạo bản sao con trỏ của riêng nó để trỏ đến một nơi khác, điều này không liên quan đến người gọi.


[B. MAKE/CMAKE](#make)

[1. Understand make process](#make1)

[C. BUID OPTIMIZATION](#opt)

[1. -O2, -O3](#opt1)

[2. Strip symbols"](#opt2)

### B. CMake / Make 

<a id="make"> </a>

Tạo phần mềm không chỉ là viết mã; bạn cần xây dựng tất cả source code để tạo ra phần mềm có thể sử dụng được. Quá trình xây dựng này có thể được thực hiện thủ công nhưng có thể trở nên khó khăn khi bạn bắt đầu làm việc với các dự án lớn. 

Đây là nơi các công cụ như CMake và Make có thể giúp tự động hóa quy trình. Cả hai công cụ này đều cho phép chuyển từ source code sang tệp thực thi.

**Biên dịch (Compilation) là gì?**

Biên dịch là quá trình dich từ mã nguồn ( code ) sang mã máy ( nhị phân). Quá trình này bao gồm một số bước : preprocessing , compiling, linking để tạo ra một thư viện hoặc một tệp thực thi có thể được chạy trực tiếp bởi máy tính.

![alt](https://earthly.dev/blog/assets/images/cmake-vs-make-diff/IbLS3QY.png)

*Quá trình biên dịch này còn được gọi là quá trình xây dựng và là nơi CMake và Make tham gia vào.*

**CMAKE và MAKE hoạt động như thế nào ?**

CMake và Make giúp tự động hóa và tiết kiệm thời gian bằng cách đưa tất cả các lệnh cần thiết để xây dựng chương trình vào tệp Makefile hoặc CMakeLists.txt mà ta không cần gõ lại từng dòng code.

Make là 1 tool giúp control việc tạo các tệp thực thi và các  non–source files khác của chương trình từ các tệp nguồn của chương trình. Nó lấy hướng dẫn về cách xây dựng chương trình từ một tệp có tên là Makefile.

Còn đối với CMAKE thì nó yêu cầu 1 file CMakeList.txt đa nền tảng (cross-platform Make). 
-> Nó hoạt động được trên nhiều hệ điều hành khác nhau.

CMAKE cho phép xây dựng :  compiler-independent builds, testing, packaging, và các trình tải xuống của phần mềm. 

**Lưu ý: CMake tạo file xây dựng cho các hệ thống khác. Nó không phải là một hệ thống xây dựng.**

CMake tạo ra Makefile và sau đó Makefile được tạo có thể được sử dụng với Make trong nền tảng đang được xử lý:


![alt](https://earthly.dev/blog/assets/images/cmake-vs-make-diff/5Gv149z.png)

Để sử dụng Make, bạn phải tạo Makefile theo cách thủ công, nhưng với CMake, Makefile sẽ được tạo tự động. 

#### Installing CMake và Make
```
cmake --version
```
Output :

```
cmake version 3.24.2

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```

Tiếp theo kiểm tra make:

```
make --version
```

Output:

```
GNU Make 4.1
Built for x86_64-pc-linux-gnu
Copyright (C) 1988-2014 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

Kiểm tra MSBuild (đối với window) :

```
msbuild -version
```

Output
```
Microsoft (R) Build Engine version 15.8.168+ga8fba1ebd7 for .NET Framework
Copyright (C) Microsoft Corporation. All rights reserved.

15.8.168.64424
```

**Lưu ý:** Để sử dụng CMake trên Windows, bạn cần cài đặt MSBuild, một công cụ xây dựng.

#### Mối quan hệ giữa MAKE và CMAKE:

Để build project thì hãy chắc chắn rằng CMake đã được cài đặt trên máy. Nếu hệ điều hành của bạn là một flavor của Linux thì hãy cài dặt nó thông qua package manager.

Ubuntu:
```
FRAMGIA\luong.the.vinh@framgia0221-pc:~$ sudo apt-get install cmake
FRAMGIA\luong.the.vinh@framgia0221-pc:~$ cmake -version
cmake version 3.5.1

```

**Ví dụ 1: Hello World**

Code cho project này có thể tìm thấy ở thư mục. Trong ví dụ này thì một chương trình Hello World đơn giản sẽ được build (HelloWorld.cpp):
```
#include<iostream>

int main(int argc, char *argv[]){
   std::cout << "Hello World!" << std::endl;
   return 0;
}
```
Ngoài file **HelloWorld.cpp** ra thì chúng ta sẽ cần đến một file khác ở cùng thư mục là CMakeLists.txt có nội dung như sau:

```
cmake_minimum_required(VERSION 2.8.9)
project (hello)
add_executable(hello helloworld.cpp)

```
File này chỉ có 3 dòng và có ý nghĩa như sau:

- Dòng đầu tiên sẽ định nghĩa phiên bản thấp nhất của CMake dành cho project này.

- Dòng thứ hai sử dụng lệnh project() để đặt tên cho project.

- Dòng thứ ba là lệnh add_executable(). Lệnh này nhằm mục đích tạo thêm một executable. Đối số đầu truyền vào là tên của executable sẽ được tạo, đối số thứ hai là source file sẽ được dùng để build executable.


Bây giờ thì chúng ta đã sẵn sàng để build project HelloWorld sử dụng CMake. Chúng ta sẽ thực thi lệnh cmake kèm đường dẫn chứa source code và file CmakeLists.txt. Trong trường hợp này thì "." sẽ dùng để trỏ đến thư mục hiện tại:

```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ cmake .
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/luong.the.vinh/Workspaces/Examples/exploringBB/extras/cmake/helloworld

```

CMake sẽ xác định cấu hình môi trường được cài đặt trên máy và tạo một file Makefile cho project này. Chúng ta có thể xem và edit Makefile được tạo này, tuy nhiên thì những sự thay đổi chúng ta tạo ra sẽ bị ghi đè lại mỗi lần chúng ta chạy lại lệnh cmake.

Một khi Makefile đã được tạo thì chúng ta sẽ dùng lệnh make để build project:

```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ make
Scanning dependencies of target hello
[ 50%] Building CXX object CMakeFiles/hello.dir/helloworld.cpp.o
[100%] Linking CXX executable hello
[100%] Built target hello
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ ls -l hello
-rwxr-xr-x 1 FRAMGIA\luong.the.vinh FRAMGIA\domain^users 9224 Th08 20 09:58 hello
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ ./hello
Hello World!
```

Project chúng ta build đã chạy! Như các bạn thấy thì quá trình build chương trình HelloWorld.cpp này thực sự có hơi rườm rà nhưng lại rất quan trọng đối với những người mới học bởi nó giải thích các hoạt động cơ bản của CMake. Bây giờ thì chúng ta đã sẵn sàng xem xét đến một số ví dụ CMake phức tạp hơn.

**Ví dụ 2: Một project với nhiều directory**

Khi project của chúng ta bắt đầu phình to thì chúng ta sẽ muốn quản lý chúng dưới dạng nhiều sub-directory. Việc sử dụng Makeflies trở nên khá dài dòng khi có sự hiện diện của sub-directories do trong thực tế thì việc tạo một Makefile trong mỗi sub-directory là việc rất phổ biến. Các Makefile này sau đó sẽ được gọi bởi Makefile trong thư mục cha.

Cmake sẽ tỏ ra rất hữu dụng trong trường hợp này. Trong ví dụ này thì một project với cấu trúc thư mục điển hình sẽ được sử dụng. Chúng ta sẽ điều hướng terminal đến thư mục /exploringBB/extras/cmake/student có cấu trúc thư mục như sau:
```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student$ tree
.
├── build
├── CMakeLists.txt
├── include
│   └── Student.h
└── src
    ├── mainapp.cpp
    └── Student.cpp

3 directories, 4 files

```

Dạo đầu với CMake thông qua ví dụ
Trong bài viết này mình sẽ trình bày các ví dụ đơn giản và mang tính ứng dụng cao trong việc áp dụng CMake để xây dựng một project C++. Các ví dụ mình đều thực hiện trên Ubuntu.

Tiện ích make và Makefiles cung cấp một hệ thống build mà chúng ta có thể sử dụng để quản lý việc compile và re-compilation của một chương trình được viết bằng ngôn ngữ bất kỳ. Việc sử dụng Makefiles đôi khi lại có thể trở thành một công việc phức tạp trong trường hợp project mà chúng ta build có nhiều sub directories hoặc sẽ phải triển khai trên nhiều nền tảng khác nhau.

Để khắc phục điều đó thì CMake ra đời. CMake là một công cụ sinh Makefile đa nền tảng. Nói đơn giản thì CMake sẽ tự động tạo ra Makefiles cho project của chúng ta. Ngoài ra thì nó cũng làm được nhiều hơn nhưng trong khuôn khổ bài viết thì mình sẽ chỉ tập trung vào việc tự động sinh Makefiles cho các project C/C++.

Ví dụ 1: Hello World
Code cho project này có thể tìm thấy ở thư mục. Trong ví dụ này thì một chương trình Hello World đơn giản sẽ được build (HelloWorld.cpp):

#include<iostream>

int main(int argc, char *argv[]){
   std::cout << "Hello World!" << std::endl;
   return 0;
}

Ngoài file HelloWorld.cpp ra thì chúng ta sẽ cần đến một file khác ở cùng thư mục là CMakeLists.txt có nội dung như sau:

cmake_minimum_required(VERSION 2.8.9)
project (hello)
add_executable(hello helloworld.cpp)

File này chỉ có 3 dòng và có ý nghĩa như sau:

Dòng đầu tiên sẽ định nghĩa phiên bản thấp nhất của CMake dành cho project này.

Dòng thứ hai sử dụng lệnh project() để đặt tên cho project.

Dòng thứ ba là lệnh add_executable(). Lệnh này nhằm mục đích tạo thêm một executable. Đối số đầu truyền vào là tên của executable sẽ được tạo, đối số thứ hai là source file sẽ được dùng để build executable.

Để build project thì hãy chắc chắn rằng CMake đã được cài đặt trên máy. Nếu hệ điều hành của bạn là một flavor của Linux thì hãy cài dặt nó thông qua package manager, ví dụ như với Ubuntu:

```
FRAMGIA\luong.the.vinh@framgia0221-pc:~$ sudo apt-get install cmake
FRAMGIA\luong.the.vinh@framgia0221-pc:~$ cmake -version
cmake version 3.5.1

Điều hướng terminal đến thư mục chứa code project và check xem có đủ 2 file ở trên không:

FRAMGIA\luong.the.vinh@framgia0221-pc:~$ cd ~/Workspaces/Examples/exploringBB/extras/cmake/helloworld/
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ ls
CMakeLists.txt  helloworld.cpp
```


Bây giờ thì chúng ta đã sẵn sàng để build project HelloWorld sử dụng CMake. Chúng ta sẽ thực thi lệnh cmake kèm đường dẫn chứa source code và file CmakeLists.txt. Trong trường hợp này thì "." sẽ dùng để trỏ đến thư mục hiện tại:

FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ cmake .
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/luong.the.vinh/Workspaces/Examples/exploringBB/extras/cmake/helloworld

CMake sẽ xác định cấu hình môi trường được cài đặt trên máy và tạo một file Makefile cho project này. Chúng ta có thể xem và edit Makefile được tạo này, tuy nhiên thì những sự thay đổi chúng ta tạo ra sẽ bị ghi đè lại mỗi lần chúng ta chạy lại lệnh cmake.

Một khi Makefile đã được tạo thì chúng ta sẽ dùng lệnh make để build project:
```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ make
Scanning dependencies of target hello
[ 50%] Building CXX object CMakeFiles/hello.dir/helloworld.cpp.o
[100%] Linking CXX executable hello
[100%] Built target hello
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ ls -l hello
-rwxr-xr-x 1 FRAMGIA\luong.the.vinh FRAMGIA\domain^users 9224 Th08 20 09:58 hello
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/helloworld$ ./hello
Hello World!
```



Project chúng ta build đã chạy! Như các bạn thấy thì quá trình build chương trình HelloWorld.cpp này thực sự có hơi rườm rà nhưng lại rất quan trọng đối với những người mới học bởi nó giải thích các hoạt động cơ bản của CMake. Bây giờ thì chúng ta đã sẵn sàng xem xét đến một số ví dụ CMake phức tạp hơn.

Ví dụ 2: Một project với nhiều directory
Khi project của chúng ta bắt đầu phình to thì chúng ta sẽ muốn quản lý chúng dưới dạng nhiều sub-directory. Việc sử dụng Makeflies trở nên khá dài dòng khi có sự hiện diện của sub-directories do trong thực tế thì việc tạo một Makefile trong mỗi sub-directory là việc rất phổ biến. Các Makefile này sau đó sẽ được gọi bởi Makefile trong thư mục cha.

Cmake sẽ tỏ ra rất hữu dụng trong trường hợp này. Trong ví dụ này thì một project với cấu trúc thư mục điển hình sẽ được sử dụng. Chúng ta sẽ điều hướng terminal đến thư mục /exploringBB/extras/cmake/student có cấu trúc thư mục như sau:
```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student$ tree
.
├── build
├── CMakeLists.txt
├── include
│   └── Student.h
└── src
    ├── mainapp.cpp
    └── Student.cpp

3 directories, 4 files

```

Các bạn có thể thấy là tất cả các file header (.h) được đặt trong thư mục include và tất cả các file mã nguồn (.cpp) được đặt trong thư mục src. Ngoài ra thì có cả thư mục build (hiện đang rỗng) được sử dụng để chứa các file binary executable và các file tạm cần thiết cho quá trình build. File CmakeLists.txt cho project này sẽ có một chút khác biệt so với file được sử dụng trong ví dụ 1:
```
cmake_minimum_required(VERSION 2.8.9)
project(directory_test)

include_directories(include)

#set(SOURCES src/mainapp.cpp src/Student.cpp)

file(GLOB SOURCES "src/*.cpp")

add_executable(testStudent ${SOURCES})

```

Các thay đổi quan trọng trong file CMake này là như sau:

Hàm include_directories() được sử dụng để tích hợp các file header vào trong môi trường build.

Hàm set(SOURCE...) có thể được sử dụng để đặt một biến (SOURCE) chứa tất cả tên của các file source (.cpp) trong project. Tuy nhiên thì bởi mỗi một file source cần được thêm một cách thủ công nên dòng tiếp theo sẽ được dùng thay thế lệnh này và hàm set sẽ bị comment lại.
Hàm file() được sử dụng để thêm source file vào project. GLOB (hoặc GLOB_RECURSE) sẽ được sử dụng để tạo một danh sách các file thỏa mãn expression được khai báo (ví dụ: src/*.cpp) và thêm chúng vào biến SOURCE.

Hàm add_executable() sử dụng biến SOURCE thay vì việc sử dụng tham chiếu cụ thể của từng source file để build một chương trình executable là testStudent.

Trong ví dụ này thì tất cả các file build sẽ được đặt ở trong thư mục build. Chúng ta có thể làm việc này một cách dễ dàng bằng cách gọi cmake từ thư mục build như sau:

```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student$ cd build
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student/build$ cmake ..
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
...
```
Thư mục build lúc này sẽ bao gồm Makefile cho project, Makefile sẽ tham chiếu chính xác đến các file trong thư mục src và include. Project lúc này sẽ có thể được build từ thư mục build sử dụng lệnh make

```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student/build$ ls
CMakeCache.txt  CMakeFiles  cmake_install.cmake  Makefile
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student/build$ make
...
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student/build$ ls
CMakeCache.txt  CMakeFiles  cmake_install.cmake  Makefile  testStudent
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student/build$ ./testStudent
A student with name Joe
```

Một ưu điểm dễ thấy của cách tiếp cận này là tất cả các file liên quan đến quá trình build đều nằm trong thư mục build. Để clean project thì chúng ta đơn giản là chỉ cần xóa đệ quy tất cả files/directories nằm trong thư mục build, ví dụ:

```
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student/build$ cd ..
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student$ rm -r build/*
FRAMGIA\luong.the.vinh@framgia0221-pc:~/Workspaces/Examples/exploringBB/extras/cmake/student$ tree
.
├── build
├── CMakeLists.txt
├── include
│   └── Student.h
└── src
    ├── mainapp.cpp
    └── Student.cpp

3 directories, 4 files
```

Như các bạn thấy thì cấu trúc cây thư mục của project là tương tự như trước khi cmake được thực thi.

**Lưu ý**: Mỗi lần thêm source file mới vào project thì chúng ta sẽ phải chạy lại cmake. Do chúng ta cần phải cập nhật lại Makefiles cho những thay đổi mới.

Tài liệu tham khảo 

[Dạo đầu với CMake thông qua ví dụ](https://viblo.asia/p/dao-dau-voi-cmake-thong-qua-vi-du-07LKXNbelV4)

[Quản lý các shared libary trong linux](https://manthang.wordpress.com/2010/12/04/quan-ly-cac-shared-library-trong-linux/)

[Hướng dẫn Make File cơ bản](https://www.cs.colby.edu/maxwell/courses/tutorials/maketutor/)

<a id="opt2"></a>

#### Hiểu ELF ?
 Nêu vấn đề: Khi source code lớn, có thể chia code thành các lớp/tệp con nhỏ hơn hoặc các đơn vị tổ chức chung.
 Trong C/C++, thuật ngữ này được gọi là thư viện dùng chung và định dạng tệp Elf cung cấp chức năng này thông qua Relocation, Symbols and Dynamic Linking. Điều đó có nghĩa là những "thứ" được relocated là symbol và symbols phần lớn là các variables và function có các dạng khác nhau.

**Khái niệm**  : ELF (Executable and Linkable Format) là một tệp tin được sử dụng để lưu trữ source code của các chương trình thực thi và thư viện trong các hệ điều hành Unix và Unix-like. Nó cung cấp cấu trúc để tổ chức và lưu trữ các thành phần quan trọng của một ứng dụng hoặc thư viện như source code, Dynamic Linking, phân đoạn, bảng ký hiệu, và các thông tin khác.
