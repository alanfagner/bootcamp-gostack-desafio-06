import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor(props) {
    super(props);
    this.user = props.navigation.getParam('user');
    this.state = { stars: [], page: 1, loading: true, loadMore: false };
  }

  async componentDidMount() {
    this.loadingStars(1, []);
  }

  loadingStars = async (page, stars) => {
    const { navigation } = this.props;

    const user = navigation.getParam('user');
    try {
      const { data } = await api.get(`users/${user.login}/starred`, {
        params: {
          page,
        },
      });
      this.setState({
        stars: stars.concat(data),
        loading: false,
        page,
        loadMore: false,
      });
    } catch (error) {
      this.setState({ loading: false, loadMore: false });
    }
  };

  loadMore = () => {
    const { stars, page, loadMore, loading } = this.state;
    this.setState({ loadMore: true });
    if (!loadMore && !loading) {
      this.loadingStars(page + 1, stars);
    }
  };

  refreshList = () => {
    const { loadMore, loading } = this.state;
    this.setState({ loading: true });
    if (!loadMore && !loading) {
      this.loadingStars(1, []);
    }
  };

  handleFavorite = repository => {
    const { navigation } = this.props;
    navigation.navigate('Favorite', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadMore } = this.state;

    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator color="#333" />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={loading}
            ListFooterComponent={() =>
              loadMore && <ActivityIndicator color="#333" />
            }
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleFavorite(item)}>
                <OwnerAvatar
                  source={{
                    uri: item.owner.avatar_url && item.owner.avatar_url,
                  }}
                />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

User.defaultProps = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};
