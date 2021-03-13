import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";

const data = [
  {
    option: "Better luck next time!",
    style: { backgroundColor: "#832a4a", textColor: "#e5d2da" },
  },
  {
    option: "2X Savings",
    style: { backgroundColor: "#742544", textColor: "#e2d2d8" },
  },
  {
    option: "₹100 Cashback",
    style: { backgroundColor: "#551b31", textColor: "#e9e1e4" },
  },
  {
    option: "₹20 💸",
    style: { backgroundColor: "#65203a", textColor: "#e9dfe3" },
  },
  {
    option: "₹50 💸",
    style: { backgroundColor: "#832a4a", textColor: "#e5d2da" },
  },
  {
    option: "1.5X Savings",
    style: { backgroundColor: "#742544", textColor: "#e2d2d8" },
  },
  {
    option: "2X Savings",
    style: { backgroundColor: "#551b31", textColor: "#e9e1e4" },
  },
  {
    option: "₹50 💸",
    style: { backgroundColor: "#65203a", textColor: "#e9dfe3" },
  },
];

export default function Spinner() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [access_token, setAccess_token] = useState(
    process.env.fampay_access_token
  );
  // Id of Google Spreadsheet which is used to store data
  const spreadsheetId = process.env.fampay_spreadsheetId;

  const apiCall = () => {
    // Request Access Token from oAuth 2.0
    axios
      .post(`https://accounts.google.com/o/oauth2/v2/auth`, null, {
        params: {
          scope: "https://www.googleapis.com/auth/spreadsheets",
          include_granted_scopes: true,
          response_type: "token",
          state: "state_parameter_passthrough_value",
          redirect_uri: "http://fampay-spinner.herokuapp.com",
          client_id: process.env.fampay_client_id,
        },
      })
      .then(
        (response) => {
          console.log(response);
          setAccess_token(response);
        },
        (error) => {
          console.log(error);
        }
      );
    // Post Data to Google Spreadsheet
    var pwa = navigator.userAgentData.mobile ? "mobile-pwa" : "web-pwa";
    var data = {
      majorDimension: "ROWS",
      values: [[pwa, new Date().toISOString(), prizeNumber]],
    };
    axios
      .post(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append`,
        data,
        {
          params: {
            includeValuesInResponse: false,
            insertDataOption: "INSERT_ROWS",
            responseDateTimeRenderOption: "SERIAL_NUMBER",
            responseValueRenderOption: "FORMATTED_VALUE",
            valueInputOption: "USER_ENTERED",
            access_token: access_token,
          },
        }
      )
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    apiCall();
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          margin: "auto",
          width: "65%",
          padding: "1rem",
        }}
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          fontSize={15}
          outerBorderColor={"#dad9d6"}
          radiusLineColor={"#65203a"}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
      </div>
      <button
        onClick={handleSpinClick}
        style={{
          position: "absolute",
          left: "46%",
          top: "28%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          height: "5em",
          width: "5em",
          borderRadius: "50%",
          backgroundColor: "#ffdda1",
          borderColor: "#ddbb81",
          fontSize: "1.1rem",
        }}
      >
        <span style={{ fontSize: "1.4rem", fontWeight: "900" }}>Spin</span>
      </button>
      <div>Power Bar</div>
      <div
        className="container"
        style={{
          backgroundColor: "#ffffff",
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        <p style={{ fontSize: "2rem" }}>Spin the wheel now to get rewarded</p>
        <p style={{ fontSize: "1rem", color: "#7d7d7d" }}>
          Tap on Spin or rotate the wheel anti-clockwise and release to start
          spinning
        </p>
      </div>
      <h4>
        Have a question? <span style={{ color: "#fabd32" }}>Get Help</span>
      </h4>
    </>
  );
}
