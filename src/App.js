import React, { Component } from "react";
import "./App.css";
import Box from "3box";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav";
import { BounceLoader } from "react-spinners";
import ChatBox from "3box-chatbox-react";

import MyStore from "./pages/MyStore";
import Home from "./pages/Home";
import AddListing from "./pages/AddListing";
import Profile from "./pages/Profile";
import { SPACE_NAME } from "./Constants";

// 3Box identity
const getThreeBox = async (address) => {
  const profile = await Box.getProfile(address);
  return profile;
};

export default class App extends Component {
  // Changes to true if Metamask isn't detected, or there's a problem
  state = {
    needToAWeb3Browser: false,
  };

  /**
   * getAddressFromMetaMask => fetch the user's Ethereum account
   *  * Function isn't limited to MetaMask; works for all Web3 enabled browswers
   */
  async getAddressFromMetaMask() {
    if (typeof window.ethereum == "undefined") {
      this.setState({ needToAWeb3Browser: true });
    } else {
      window.ethereum.autoRefreshOnNetworkChange = false; //silences warning about no autofresh on network change
      const accounts = await window.ethereum.enable();
      this.setState({ accounts });
    }
  }

  /**
   * componentDidMount
   * * Take care how many times this function is called
   * * We're loading the user's listing, not all the listings from the marketplace
   * * The user is the moderator of their own store
   */
  async componentDidMount() {
    // Set the background color (need to move this out of here)
    document.body.style.backgroundColor = "#ffffff";

    // Fetch the user's ethereum account
    await this.getAddressFromMetaMask();

    // Get 3Box profile of the ethereum account
    if (this.state.accounts) {
      const threeBoxProfile = await getThreeBox(this.state.accounts[0]);
      this.setState({ threeBoxProfile });
    }
    const userMod = this.state.accounts[0];

    // Open the 3Box object of the user's account
    const box = await Box.openBox(this.state.accounts[0], window.ethereum);
    await box.syncDone;
    this.setState({ box });

    // Open the demo marketplace 'space' of the user
    const space = await this.state.box.openSpace(SPACE_NAME);
    this.setState({ space });

    // Create and fetch the listings thread of the user's store
    const thread = await space.joinThread("listing_list", {
      firstModerator: userMod,
      members: false,
    });
    this.setState({ thread }, () => this.getListingsThread());

    // Create and fetch the listings in the shopping cart
    const shoppingCart = await space.createConfidentialThread('demo-shoppingCart');
    this.setState ({ shoppingCart }, () => this.getShoppingCartThread());

    // Join global chat
    const globalChat = await space.joinThread("globalListChat");
    this.setState({ globalChat });

    // Fetch the listings in the thread of the global marketplace
    const globalThread = await space.joinThreadByAddress(
      "/orbitdb/zdpuAosv7kRPN49quPCwVr5p531SwjycjdxQeEbM9Y3SiNBp9/3box.thread.demo-marketplace.globalList"
    );
    this.setState({ globalThread }, () => this.getGlobalListingsThread());
    console.log(globalThread.address);
    const dasPosts = await globalThread.getPosts();
    console.log(dasPosts);
  }

  /**
   * getListingsThread => Fetch the listings in a user's store
   */
  async getListingsThread() {
    if (!this.state.thread) {
      console.error("listings thread not in react state");
      return;
    }

    // Fetch the listings and add them to state
    const posts = await this.state.thread.getPosts();
    this.setState({ posts });

    // Update the state when new listings are added
    await this.state.thread.onUpdate(async () => {
      const posts = await this.state.thread.getPosts();
      this.setState({ posts });
    });
  }

  /**
   * getGlobalListingsThread => Fetch the listings from the global marketplace
   */
  async getGlobalListingsThread() {
    if (!this.state.globalThread) {
      console.error("global listings thread not in react state");
      return;
    }

    // Fetch the listings and add them to state
    const globalPosts = await this.state.globalThread.getPosts();
    this.setState({ globalPosts });

    // Update the state when new listings are added
    await this.state.globalThread.onUpdate(async () => {
      const globalPosts = await this.state.globalThread.getPosts();
      this.setState({ globalPosts });
    });
  }

    /**
   * getShoppingCartThread => Fetch the cart items in a user's store
   */
  async getShoppingCartThread() {
    if (!this.state.shoppingCart) {
      console.error("shoppingCart thread not in react state");
      return;
    }

    // Fetch the cart items and add them to state
    const cartItems = await this.state.shoppingCart.getPosts();
    this.setState({ cartItems });
    console.log(this.state.cartItems)

    // Update the shopping cart when new items are added
    await this.state.shoppingCart.onUpdate(async () => {
      const cartItems = await this.state.shoppingCart.getPosts();
      this.setState({ cartItems });
    });
  }

  render() {
    if (this.state.needToAWeb3Browser) {
      return <h1>Please install metamask</h1>; //! Need something nice here
    }

    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route path="/profile">
              {this.state.space && (
                <Profile
                  box={this.state.box}
                  space={this.state.space}
                  accounts={this.state.accounts}
                  threeBoxProfile={this.state.threeBoxProfile}
                />
              )}
              {!this.state.space && (
                <div style={{ width: "60px", margin: "auto" }}>
                  <BounceLoader color={"blue"} />
                </div>
              )}
            </Route>
            <Route path="/add-listing">
              {this.state.accounts && (
                <AddListing
                  accounts={this.state.accounts}
                  thread={this.state.thread}
                  globalThread={this.state.globalThread}
                  box={this.state.box}
                  space={this.state.space}
                  threadMembers={this.state.threadMembers}
                  posts={this.state.posts}
                  globalPosts={this.state.globalPosts}
                  threeBoxProfile={this.state.threeBoxProfile}
                  getListingsThread={this.getListingsThread.bind(this)}
                  getGlobalListingsThread={this.getGlobalListingsThread.bind(
                    this
                  )}
                />
              )}
              {!this.state.accounts && <h1>Login with metamask</h1>}
            </Route>
            <Route path="/my-store">
              <MyStore
                posts={this.state.posts}
                space={this.state.space}
                box={this.state.box}
                getListingsThread={this.getListingsThread}
                usersAddress={
                  this.state.accounts ? this.state.accounts[0] : null
                }
              />
            </Route>
            <Route path="/">
              <Home
                globalPosts={this.state.globalPosts}
                space={this.state.space}
                box={this.state.box}
                getGlobalListingsThread={this.getGlobalListingsThread}
                cartItems={this.state.cartItems}
                shoppingCart={this.state.shoppingCart}
                getShoppingCartThread={this.getShoppingCartThread.bind(this)}
                usersAddress={
                  this.state.accounts ? this.state.accounts[0] : null
                }
              />
            </Route>
          </Switch>
        </div>
        <div className="userscontainer">
          {this.state.space && (
            <ChatBox
              // required
              spaceName={SPACE_NAME}
              threadName="globalListChat"
              // Required props for context A) & B)
              box={this.state.box}
              currentUserAddr={
                this.state.accounts ? this.state.accounts[0] : null
              }
              // optional
              mute={false}
              popupChat
              showEmoji
              colorTheme="#181F21"
              currentUser3BoxProfile={this.state.threeBoxProfile}
              agentProfile={{
                chatName: "ION Chat"
              }}
              openOnMount={true}
            />
          )}
        </div>
      </Router>
    );
  }
}
