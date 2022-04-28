// @ts-nocheck

import React from "react";
import renderer from "react-test-renderer";
import SearchOptionsForm from "../SearchOptionsForm";


describe("<SearchOptionsForm />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SearchOptionsForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
