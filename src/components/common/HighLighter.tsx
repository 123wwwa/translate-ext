import React, { Component, type MouseEvent } from 'react';

interface HighlighterProps {
  text: string;
  className?: string;
  selectionHandler?: (selectionDetails: {
    selection: string;
    selectionStart: number;
    selectionEnd: number;
  }) => void;
}

interface HighlighterState {
  text: string;
  isDirty: boolean;
  selection: string;
  anchorNode: Node | null;
  focusNode: Node | null;
  selectionStart: number | string;
  selectionEnd: number | string;
  first: string;
  middle: string;
  last: string;
}

export default class HighLighter extends Component<HighlighterProps, HighlighterState> {
  static defaultProps = {
    customClass: 'default',
  };

  constructor(props: HighlighterProps) {
    super(props);
    this.state = {
      text: props.text,
      isDirty: false,
      selection: '',
      anchorNode: null,
      focusNode: null,
      selectionStart: '?',
      selectionEnd: '?',
      first: '',
      middle: '',
      last: '',
    };
    this.onMouseUpHandler = this.onMouseUpHandler.bind(this);
  }

  onMouseUpHandler(e: MouseEvent<HTMLSpanElement>) {
    e.preventDefault();
    const selectionObj = window.getSelection();
    if (!selectionObj) return;
    
    const selection = selectionObj.toString();
    const anchorNode = selectionObj.anchorNode;
    const focusNode = selectionObj.focusNode;
    const anchorOffset = selectionObj.anchorOffset;
    const focusOffset = selectionObj.focusOffset;

    if (!anchorNode || !focusNode) return;

    const position = anchorNode.compareDocumentPosition(focusNode);
    let forward = false;

    if (position === Node.DOCUMENT_POSITION_FOLLOWING) {
      forward = true;
    } else if (position === 0) {
      forward = (focusOffset - anchorOffset) > 0;
    }

    let selectionStart = forward ? anchorOffset : focusOffset;

    if (forward) {
      if (anchorNode.parentElement?.getAttribute('data-order') === 'middle') {
        selectionStart += Number(this.state.selectionStart);
      }
      if (anchorNode.parentElement?.getAttribute('data-order') === 'last') {
        selectionStart += Number(this.state.selectionEnd);
      }
    } else {
      if (focusNode.parentElement?.getAttribute('data-order') === 'middle') {
        selectionStart += Number(this.state.selectionStart);
      }
      if (focusNode.parentElement?.getAttribute('data-order') === 'last') {
        selectionStart += Number(this.state.selectionEnd);
      }
    }

    const selectionEnd = selectionStart + selection.length;
    const first = this.state.text.slice(0, selectionStart);
    const middle = this.state.text.slice(selectionStart, selectionEnd);
    const last = this.state.text.slice(selectionEnd);

    this.setState({
      selection,
      anchorNode,
      focusNode,
      selectionStart,
      selectionEnd,
      first,
      middle,
      last,
    });

    if (this.props.selectionHandler) {
      this.props.selectionHandler({
        selection,
        selectionStart,
        selectionEnd,
      });
    }
  }

  render() {
    if (!this.state.selection) {
      return (
        <span onMouseUp={this.onMouseUpHandler} className={this.props.className}>
          {this.state.text}
        </span>
      );
    } else {
      return (
        <span onMouseUp={this.onMouseUpHandler} className={this.props.className}>
          <span data-order="first">
            {this.state.first}
          </span>
          <span
            data-order="middle"
            className={"bg-amber-300"}
          >
            {this.state.middle}
          </span>
          <span data-order="last">
            {this.state.last}
          </span>
        </span>
      );
    }
  }
}
