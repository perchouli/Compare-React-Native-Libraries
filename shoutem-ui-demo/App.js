import React from 'react';
import { Screen, NavigationBar, ImageBackground, Tile, Divider, ListView, Title, Subtitle, Html, TextInput, Button, View, Text, Caption } from '@shoutem/ui';
import { Font, AppLoading } from 'expo';
import { createStackNavigator } from 'react-navigation';
import { ScrollView, TouchableOpacity, Button as RNButton } from 'react-native';

class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      fontsAreLoaded: false,
      posts: []
    };
  }

  static navigationOptions ({ navigation }) {
    return {
      headerTitle: 'Posts',
      headerRight: (
        <RNButton
          onPress={() => navigation.navigate('Login')}
          title="Login"
        />
      )
    };
  }

  async componentWillMount () {
    await Font.loadAsync({
      'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf')
    });
    fetch('https://dmyz.org/wp-json/wp/v2/posts?categories=79').then(r => r.json()).then(posts => this.setState({ posts }));
    this.setState({ fontsAreLoaded: true });
  }

  renderRow (post) {
    return (
      <View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Post', { postId: post.id })}>
          <ImageBackground
            styleName="large-banner"
            source={{ uri: 'https://picsum.photos/320/480/?random' }}
          >
            <Tile>
              <Title styleName="md-gutter-bottom">{post.title.rendered}</Title>
              <Subtitle styleName="sm-gutter-horizontal">{post.link}</Subtitle>
            </Tile>
          </ImageBackground>
          <Divider styleName="line" />
        </TouchableOpacity>
      </View>
    );
  }

  render () {
    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }
    const posts = this.state.posts;

    return (
      <Screen>
        <ListView
          data={posts}
          renderRow={data => this.renderRow(data)}
        />
      </Screen>
    );
  }
}

class PostScreen extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      post: undefined
    };
  }

  componentWillMount () {
    const postId = this.props.navigation.state.params.postId;
    fetch(`https://dmyz.org/wp-json/wp/v2/posts/${postId}`).then(r => r.json()).then(post => this.setState({ post }));
  }

  render () {
    const post = this.state.post;
    if (!post) {
      return <AppLoading />;
    }

    return (
      <ScrollView>
        <Tile styleName="text-centric">
          <Title styleName="sm-gutter-bottom">{post.title.rendered}</Title>
          <Caption>{post.date}</Caption>
        </Tile>

        <Html body={post.content.rendered} />
      </ScrollView>
    );
  }
}

class LoginScreen extends React.Component {
  render () {
    return (
      <Screen>
        <NavigationBar
          title="Login"
          styleName="inline"
        />
        <TextInput placeholder={'Username or email'} />
        <TextInput placeholder={'Password'} secureTextEntry />
        <View>

          <Button styleName="secondary">
            <Text>LOGIN</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Post: PostScreen,
    Login: LoginScreen
  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends React.Component {
  render () {
    return <RootStack />;
  }
}
