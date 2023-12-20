import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export class Test extends Component {
  render() {
    // eslint-disable-next-line no-console
    console.log(this.props);

    return (
      <div>
        To jest komponent klasowy
      </div>
    );
  }
}

export default React.memo(Test);
