import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function LoginRequiredRoute({
  component: Component,
  ...kwargs
}) {
  const renderComponent = () => {
    return (
      <Route
        {...kwargs}
        render={props => {
          if (kwargs.isAuthenticated) {
            return <Component {...props} />
          } else {
            return (
              <Redirect
                to={{
                  pathname: "/account/login",
                  state: { from: props.location }
                }}
              />
            )
          }
        }}
      />
    )
  }

  return (
    <div>
      {renderComponent()}
    </div>
  )
}
