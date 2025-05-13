import { a as n, u, j as e } from "./index-J0HNuP5J.js";
import { b as p, a as f } from "./js.cookie-47-wOPc-.js";
const y = () => {
  const [a, d] = n.useState(""),
    [r, c] = n.useState(""),
    x = u(),
    m = async (s) => {
      var i, o;
      if ((s.preventDefault(), !a || !r)) {
        alert("Both email and password are required.");
        return;
      }
      try {
        const t = { email: a, password: r },
          l = await p.post("http://103.189.173.127:3000/auth/admin/login", t, {
            headers: { "Content-Type": "application/json" },
            withCredentials: !0,
          });
        if ((console.log("Response:", l.data), l.data.status === 200)) {
          console.log("Login Success");
          const g = l.data.data.token;
          f.set("token", g, { expires: 7, secure: !1, sameSite: "Strict" }),
            console.log("cookies set"),
            x("/");
        } else alert("Login failed! Please try again.");
      } catch (t) {
        console.error("Login Error:", t),
          alert(
            ((o = (i = t.response) == null ? void 0 : i.data) == null
              ? void 0
              : o.message) ||
              "An error occurred during login. Please try again."
          );
      }
    };
  return e.jsxs("div", {
    className: "lg:flex min-h-screen",
    children: [
      e.jsxs("div", {
        className: "lg:w-1/2 xl:max-w-screen-sm",
        children: [
          e.jsx("div", {
            className:
              "py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12",
            children: e.jsx("div", {
              className: "cursor-pointer flex items-center",
              children: e.jsx("div", {
                className:
                  " text-3xl text-indigo-800 tracking-wide ml-2 font-semibold",
                children: "Ecommerce Admin",
              }),
            }),
          }),
          e.jsxs("div", {
            className:
              "mt-10 px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl",
            children: [
              e.jsx("h2", {
                className:
                  "text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl",
                children: "Log in",
              }),
              e.jsxs("form", {
                className: "mt-12",
                onSubmit: m,
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className: "text-sm font-bold text-gray-700",
                        children: "Email Address",
                      }),
                      e.jsx("input", {
                        className:
                          "w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500",
                        type: "email",
                        placeholder: "mike@gmail.com",
                        value: a,
                        onChange: (s) => d(s.target.value),
                        required: !0,
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-8",
                    children: [
                      e.jsx("div", {
                        className: "flex justify-between items-center",
                        children: e.jsx("label", {
                          className: "text-sm font-bold text-gray-700",
                          children: "Password",
                        }),
                      }),
                      e.jsx("input", {
                        className:
                          "w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500",
                        type: "password",
                        placeholder: "Enter your password",
                        value: r,
                        onChange: (s) => c(s.target.value),
                        required: !0,
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "mt-10",
                    children: e.jsx("button", {
                      type: "submit",
                      className:
                        "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold hover:bg-indigo-600 shadow-lg",
                      children: "Log In",
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsx("div", {
        className:
          "hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen",
      }),
    ],
  });
};
export { y as default };
