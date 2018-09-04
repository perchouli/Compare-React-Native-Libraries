import React from 'react';
import { List, Card, Button, Text, FormLabel, FormInput } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation';
import { View, ScrollView, WebView } from 'react-native';

class HomeScreen extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  static navigationOptions ({ navigation }) {
    return {
      headerTitle: 'Posts',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Login')}
          title="Login"
        />
      )
    };
  }

  componentDidMount () {
    fetch('https://dmyz.org/wp-json/wp/v2/posts?categories=79').then(r => r.json()).then(posts => this.setState({ posts }));
  }

  render () {
    return (
      <ScrollView>
        <List containerStyle={{ marginBottom: 20 }}>

          {this.state.posts.map((post, i) => {
            return (
              <Card
                key={post.id}
                title={post.title.rendered}
                image={{ url: 'https://picsum.photos/320/480/?random' }}
              >
                <Button
                  icon={{ name: 'code' }}
                  title='VIEW NOW'
                  onPress={() => this.props.navigation.navigate('Post', { postId: post.id })}
                />
              </Card>
            );
          })}
        </List>
      </ScrollView>
    );
  }
}

class PostScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      post: null
    };
  }

  componentDidMount () {
    const postId = this.props.navigation.getParam('postId');
    if (postId) {
      fetch(`https://dmyz.org/wp-json/wp/v2/posts/${postId}`).then(r => r.json()).then(post => this.setState({ post }));
    }
  }

  render () {
    const post = this.state.post;
    if (!post) {
      return <View />;
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'flex-start'
        }}
      >
        <Text h3>{post.title.rendered}</Text>
        <WebView source={{ html: post.content.rendered }} style={{
          alignSelf: 'stretch'
        }} scalesPageToFit = {false} />
      </View>
    );
  }
}

class LoginScreen extends React.Component {
  render () {
    return (
      <View>
        <FormLabel>Username or email</FormLabel>
        <FormInput />

        <FormLabel>Password</FormLabel>
        <FormInput secureTextEntry />

        <Button title='LOGIN' />
      </View>
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
