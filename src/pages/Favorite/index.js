import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default class Favorite extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  constructor(props) {
    super(props);
    this.state = {
      repository: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');

    this.setState({ repository });
  }

  render() {
    const { repository } = this.state;
    if (repository) {
      return (
        <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
      );
    }
    return null;
  }
}

Favorite.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

Favorite.defaultProps = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};
