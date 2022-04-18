// @ts-nocheck

import React from "react";
import renderer from "react-test-renderer";
import Colors from "../constants/Colors";
import { sizes } from "../constants/Font";
import { Button, Text, TextInput } from "./Themed";

describe("<Text />", () => {
  const text = "Hello world!";

  it("renders correctly", () => {
    const tree = renderer.create(<Text>{text}</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("has body font size as default", () => {
    const tree = renderer.create(<Text>{text}</Text>).toJSON();
    expect(tree.props.style[0]).toMatchObject({ fontSize: sizes.body });
  });
  it("renders font sizes correctly", () => {
    const smallCaption = renderer
      .create(<Text variant="smallCaption">{text}</Text>)
      .toJSON();
    const caption = renderer
      .create(<Text variant="caption">{text}</Text>)
      .toJSON();
    const body = renderer.create(<Text variant="body">{text}</Text>).toJSON();
    const subtitle = renderer
      .create(<Text variant="subtitle">{text}</Text>)
      .toJSON();
    const title = renderer.create(<Text variant="title">{text}</Text>).toJSON();

    expect(smallCaption.props.style[0]).toMatchObject({
      fontSize: sizes.smallCaption,
    });
    expect(caption.props.style[0]).toMatchObject({ fontSize: sizes.caption });
    expect(body.props.style[0]).toMatchObject({ fontSize: sizes.body });
    expect(subtitle.props.style[0]).toMatchObject({ fontSize: sizes.subtitle });
    expect(title.props.style[0]).toMatchObject({ fontSize: sizes.title });
  });
  it("matches disabled color when disabled", () => {
    const tree = renderer.create(<Text disabled>{text}</Text>).toJSON();
    expect(tree.props.style[0]).toMatchObject({
      color: Colors.light.textDisabled,
    });
  });
});

describe("<TextInput />", () => {
  const input = "Hello World!";

  it("renders correctly", () => {
    const tree = renderer.create(<TextInput />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("can take input", () => {
    const tree = renderer.create(<TextInput value={input} />).toJSON();
    expect(tree.props.value).toBe(input);

    const newInput = "New Input";
    tree.props.value = newInput;

    expect(tree.props.value).toBe(newInput);
  });
  it("has placeholder text color", () => {
    const tree = renderer.create(<TextInput placeholder={input} />).toJSON();
    expect(tree.props.placeholderTextColor).toBe(Colors.light.placeholderText);
  });
  it("has default body font size", () => {
    const tree = renderer.create(<TextInput value={input} />).toJSON();
    expect(tree.props.style[0]).toMatchObject({ fontSize: sizes.body });
  });
});

describe("<Button />", () => {
  const text = "Hello World!";

  it("renders correctly", () => {
    const tree = renderer.create(<Button />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
