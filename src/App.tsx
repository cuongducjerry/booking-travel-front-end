import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
