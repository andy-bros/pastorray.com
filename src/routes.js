import React from "react";
import { Route, Switch } from "react-router-dom";
import Donate from "./components/Donate/Donate";
import Products from "./components/Product/Product";
import DonateForm from "./components/Donate/DonateForm";
import Checkout from "./components/Donate/Checkout";
import Messages from "./components/Messages/Messages";
import Home from "./components/Home/Home";
import Courses from "./components/Messages/Courses";
import SpecificMessages from "./components/Messages/SpecificMessages";

export default (
  /*
    Here is the backbone for our routes.
   */
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={() => <h1>About Page</h1>} />
    <Route path="/products" component={Products} />
    <Route
      path="/products/:product_id"
      component={() => <h1>Individual product</h1>}
    />
    <Route path="/contact" component={() => <h1>Contact page</h1>} />
    <Route path="/donations" component={() => <h1>Donations Page</h1>} />
    <Route path="/checkout" component={Donate} />
    <Route path="/donate" component={DonateForm} />
    <Route path="/messages/:messages" component={SpecificMessages} />
    <Route path="/courses/:courses" component={SpecificMessages} />
    <Route path="/messages" component={Messages} />
    <Route path="/courses" component={Courses} />
  </Switch>
);
