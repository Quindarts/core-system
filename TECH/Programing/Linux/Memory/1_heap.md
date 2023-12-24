 #  MEMORY

## Mục lục

[Translating Heap](#thetieude1)


[Operations of Heap Data Structure](#thetieude2)


[Data structure](#thetieude3)

[Source example](#thetieude4)

[Document](#thetieude5)

*********************************

## Translating Heap<a id="thetieude1"></a>

 Heap là một cấu trúc dữ liệu dựa trên Cây đặc biệt, trong đó cây là cây nhị phân hoàn chỉnh.
 Cây nhị phân mà mỗi đỉnh có đúng hai con được gọi là "cây nhị phân đầy đủ" (full binary tree).
 Cây nhị phân đầy đủ mà tất cả các lá có cùng độ sâu được gọi là “cây nhị phân hoàn chỉnh” (perfect binary tree).

## Operations of Heap Data Structure<a id="thetieude2"></a>


 **Heapify**: một quá trình tạo 1 Heap từ 1 Array.

 **Insertion**: quá trình thêm một phần tử vào heap. O(log N)

 **Delete** : xóa phần tử trên cùng của heap hoặc phần tử có mức ưu tiên cao nhất.
 sau đó sắp xếp heap và trả về phần tử. O(log N).

 **Peek**: để kiểm tra hoặc tìm phần tử đầu tiên (hoặc có thể nói là phần trên cùng) của heap.

## Data structure<a id="thetieude3"></a>

 **Max-Heap** : 
 Trong Max-Heap, khóa có tại nút gốc phải lớn nhất trong số các khóa có ở tất cả các nút con của nó. 
 Thuộc tính tương tự phải đúng đệ quy cho tất cả các cây con trong Cây nhị phân đó.

 **Min-Heap**: Trong Min-Heap, khóa có tại nút gốc phải ở mức tối thiểu trong số các khóa có ở tất cả các khóa con của nó.
  Thuộc tính tương tự phải đúng đệ quy cho tất cả các cây con trong Cây nhị phân đó.


## Source example <a id="thetieude4"></a>



## Document<a id="thetieude5"></a>
https:www.geeksforgeeks.org/heap-data-structure/