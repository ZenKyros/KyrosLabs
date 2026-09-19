---
title: Introduction 
type: Notes
level: Beginner
status:
tags:


* C_sharp 
---


```c#

using System;

namespace HelloWorld
{
  class Program
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Hello World!");    
    }
  }
}
```
```C#
//Program to show the use of WriteLine and Write Method
//First Import the System namespace as the
//Console class belongs to System namespace
using System;
namespace MyFirstProject
{
    internal class Program
    {
        static void Main(string[] args)
        {
            //We can access WriteLine and Write method using class name
            //as these methods are static

            //WriteLine Method Print the value and move the cursor to the next line
            Console.WriteLine("Hello");
            //Write Method Print the value and stay in the same line
            Console.Write("HI ");
            //Write Method Print the value and stay in the same line
            Console.Write("Bye ");
            //WriteLine Method Print the value and move the cursor to the next line
            Console.WriteLine("Welcome");
            //Write Method Print the value and stay in the same line
            Console.Write("C#.NET ");
            Console.ReadKey();
        }
    }
}
```