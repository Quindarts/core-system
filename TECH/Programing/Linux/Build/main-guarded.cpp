#include <iostream> // std::cout, std::endl
#include "unguarded.hpp"
#include "unguarded.hpp"

int main(int argc, char* argv[]) {
    A a(5);
    a.setA(0);
    std::cout << a.getA();
    return a.getA();
}