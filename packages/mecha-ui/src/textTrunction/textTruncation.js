import React from 'react';
import classnames from 'classnames';
import { debounce } from 'lodash/function';

export default class TextTruncation extends React.Component {
  state = {
    maxWidth: ''
  };

  componentDidMount() {
    this.init();

    window.addEventListener('resize', () => {
      debounce(this.init, 200)();
    });
  }

  componentwillreceiveprops() {
    this.init();
  }

  init = () => {
    let { maxLength, children } = this.props;
    let content = Array.isArray(children) ? children.join('') : children;

    if (maxLength && content.length > maxLength) {
      let target = ReactDOM.findDOMNode(this.refs.container);

      target.style.opacity = 0;
      target.style.maxWidth = '';
      target.style.display = 'inline-block';

      let extraLength = content.length - maxLength;
      if (extraLength < 3) {
        // 文本阶段中最后两个字符是同时截断或显示，所以超出长度文本长度不足2位时需裁剪原内容
        maxLength = content.length - extraLength + 2;
      } else {
        maxLength += 2;
      }

      target.innerText = content.slice(0, maxLength);
      let maxWidth = target.offsetWidth - 1; // 获取css数值会四舍五入，多1像素防止四舍情况

      target.innerText = content;
      target.style.display = '-webkit-box';
      target.style.opacity = 1;
      if (this.state.maxWidth == '' || this.state.maxWidth !== maxWidth) {
        this.setState(
          {
            maxWidth: `${maxWidth}px`
          },
          () => {
            target.style.maxWidth = `${maxWidth}px`; // 防止覆盖state设置的maxWidth
          }
        );
      }
    }
  };

  render() {
    const { line = 1, width, children, className, noTips } = this.props;
    const { maxWidth } = this.state;
    let content = Array.isArray(children) ? children.join('') : children;

    let style = { width, maxWidth, WebkitLineClamp: line };

    return (
      <div
        ref="container"
        className={classnames('text-trunaction', className)}
        style={style}
        title={noTips ? '' : content}
      >
        {children}
      </div>
    );
  }
}
