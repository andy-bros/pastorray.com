import React, { Component } from "react";
import {
  RadioBtn,
  InputCredentials,
  SelectBox,
  SubmitButton,
  Card
} from "./Customs";
import { states } from "./data";
import assets from "./../../assets/data";
import { CardElement, Elements, injectStripe } from "react-stripe-elements";
import axios from "axios";
import swal from "sweetalert2";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import StripeSecureLogo from "./powered_by_stripe.svg";
//////////////////////
//___GIFT_AMOUNT___///
//////////////////////
class GiftAmount extends Component {
  constructor() {
    super();
    this.state = {
      defaultAmounts: ["25", "50", "100", "200", "500"],
      frequency: [
        { value: "one-time", label: "One Time" },
        { value: "monthly", label: "Monthly" }
      ],
      currentBtn: ""
    };
  }

  render() {
    let mappedAmounts = this.state.defaultAmounts.map((el, i) => (
      <button
        key={i}
        className={this.props.selected == el ? "btn-selected" : "btn-primary"}
        name="selected"
        onClick={event => {
          this.setState({ currentBtn: el });
          this.props.handleChange({ event, value: el });
        }}
        ref={this.buttonInput}
      >
        ${el}
      </button>
    ));
    let mappedFrequencies = this.state.frequency.map(({ value, label }, i) => (
      <RadioBtn
        key={i}
        value={value}
        label={label}
        handleChange={this.props.handleChange}
        checked={this.props.checked}
      />
    ));

    return (
      <div>
        <h2 className="bottom-border title">Amount</h2>
        <div className="gift-form">
          <ul className="donation-amount">{mappedAmounts}</ul>
          <section className="frequency-amount">
            <div className="ctrl-inputs dollar-amount">
              <span>$</span>
              <input
                className="donation-input"
                value={this.props.selected}
                name="selected"
                id="money-input"
                type="number"
                placeholder="Other Amount"
                step="10"
                min="20"
                onChange={event => {
                  this.props.handleChange({
                    event,
                    value: event.target.value.replace(/[.]+/g, "")
                  });
                }}
              />
              <span className="required-input" require="true">
                *
              </span>
            </div>
            <div className="ctrl-inputs">{mappedFrequencies}</div>
          </section>
        </div>
      </div>
    );
  }
}

//////////////////////
//___CREDENTIALS___///
//////////////////////
export class Credentials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: ["Alabama", "Alaska"]
    };
  }
  toCamelCase = ({ label }) => {
    let word = label.split(" ");
    word[0] = word[0].toLowerCase();
    return word.join("");
  };

  render() {
    const {
      handleChange,
      values,
      inputFields,
      selectBox,
      purpose
    } = this.props;
    let mappedInputs = inputFields.map((e, i) => {
      let camelCase = this.toCamelCase(e);
      return (
        <InputCredentials
          currentValue={values[camelCase]}
          name={camelCase}
          key={i}
          title={e}
          handleChange={handleChange}
        />
      );
    });
    return (
      <div className="credentials-container">
        {purpose && (
          <h2 className="bottom-border title">{purpose} Information</h2>
        )}
        <div className="credentials-input">
          {mappedInputs}
          {selectBox && (
            <SelectBox
              selection={states}
              handleChange={this.props.handleChange}
            />
          )}
        </div>
      </div>
    );
  }
}
//////////////////////
//___DONATE_FORM___///
//////////////////////
export class DonateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      selected: "",
      checked: "one-time",
      inputFields: [
        { label: "First Name" },
        { label: "Last Name" },
        { label: "Email Address" }
      ]
    };
  }
  handleChange = ({ event, value }) => {
    [event.target.name][0] !== "checked" && event.preventDefault();
    this.setState({
      [event.target.name]: value
    });
  };
  submitForm = () => {
    for (let key in this.state) {
      if (key === "emailAddress" && !/^\w+@\w+\.\w+$/.test(this.state[key])) {
        return swal({
          type: "error",
          title: "Invalid email address",
          text: "Try again."
        });
      }
      if (key === "selected" && !+this.state[key]) {
        return swal({
          type: "error",
          title: "Invalid Donation amount",
          text: "Try again."
        });
      }
      if (!this.state[key].length) {
        return swal({
          type: "error",
          title: "Don't leave any inputs empty!",
          text: "Check inputs again."
        });
      }
    }
    let { firstName, lastName, emailAddress, checked } = this.state;

    this.props.stripe
      .createToken({ name: `${firstName} ${lastName}` })
      .then(res => {
        axios.post("/charge", {
          token: res.token.id,
          amount: this.state.selected,
          name: `${firstName} ${lastName}`,
          email: emailAddress,
          checked
        });
        swal({
          type: "success",
          title: `Thank you ${this.state.firstName} for your donation!`,
          text: "Check your email for a receipt."
        }).then(() => {
          this.props.history.push("/");
        });
      })
      .catch(e => {
        swal({
          type: "error",
          title: "Invalid card credentials",
          text: "Check inputs again."
        });
      });
  };
  render() {
    return (
      <div className="donation-page">
        <h2 className="section-titles">DONATE</h2>
        <Card text={assets.cardText} />
        <GiftAmount
          handleChange={this.handleChange}
          selected={this.state.selected}
          checked={this.state.checked}
        />
        <div className="secure-checkout">
          <h2 className="bottom-border title">Payment Information</h2>

          <section className="security-images">
            <i class="fa fa-lock fa-3x" />

            <img src={StripeSecureLogo} width="200px" height="45px" />
          </section>
          <div className="card-info sexy-input">
            {/* <Elements> */}
            <CardElement />

            {/* </Elements> */}
          </div>

          <Credentials
            values={this.state}
            handleChange={this.handleChange}
            inputFields={this.state.inputFields}
          />
          <SubmitButton text="Confirm Donation" submitForm={this.submitForm} />
          <br />
        </div>
      </div>
    );
  }
}

const DonateForm1 = injectStripe(
  withRouter(connect(state => state)(DonateForm))
);
class DonateForms extends Component {
  render() {
    return (
      <Elements>
        <DonateForm1 />
      </Elements>
    );
  }
}

export default DonateForms;
