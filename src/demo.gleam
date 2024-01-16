import gleam/io
import gleam/result
import gleam/list
import gleam/int

pub fn main() {
  [1, 2, 3]
  |> list.find(fn(x) { x == 2 })
  |> result.unwrap(2)
  |> int.to_string
  |> fn(x) { io.println("Hello from demo! " <> x) }
}
