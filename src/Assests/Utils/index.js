import Anchor from "../Images/Anchor";
import Bookmark from "../Images/Bookmark";
import EditIcon from "../Images/EditIcon";
import HomeIcon from "../Images/HomeIcon";
import LeftIcon from "../Images/LeftIcon";
import LogoutIcon from "../Images/LogoutIcon";
import NewPostIcon from "../Images/NewPostIcon";
import RecentIcon from "../Images/RecentIcon";
import RightIcon from "../Images/RightIcon";
import Shield from "../Images/Shield";

export const confirmations = [
  {
    id: 1,
    header: "COLLECTIONS",
    image: (width, height) => (
      <Bookmark width={width} height={height}></Bookmark>
    ),
    description: "Our latest collection inspired by you",
  },
  {
    id: 2,
    header: "HANDOVER",
    image: (width, height) => <Anchor width={width} height={height}></Anchor>,
    description: "Handover of material will be done in time",
  },
  {
    id: 3,
    header: "SECURE",
    image: (width, height) => <Shield width={width} height={height}></Shield>,
    description: "Your items are secure we are trust worthy",
  },
];

export const Images = {
  heroMainImage: require("../Images/heroMain.jpg"),
  designMainImage: require("../Images/DesignOne.png"),
};

export const bottomTabs = [
  {
    id: 1,
    tabName: "Home",
    tabIconActive: () => (
      <HomeIcon width="30px" height="30px" color="crimson"></HomeIcon>
    ),
    tabIconInActive: () => (
      <HomeIcon width="24px" height="24px" color="rgba(0,0,0,0.4)"></HomeIcon>
    ),
    to: "/admin/allPosts",
  },
  {
    id: 2,
    tabName: "Recent",
    tabIconActive: () => (
      <RecentIcon width="30px" height="30px" color="crimson"></RecentIcon>
    ),
    tabIconInActive: () => (
      <RecentIcon
        width="24px"
        height="24px"
        color="rgba(0,0,0,0.4)"
      ></RecentIcon>
    ),
    to: "/admin/recent",
  },
  {
    id: 3,
    tabName: "NewPost",
    tabIconActive: () => (
      <NewPostIcon
        width="35px"
        height="35px"
        color="crimson"
        active={true}
      ></NewPostIcon>
    ),
    tabIconInActive: () => (
      <NewPostIcon
        width="24px"
        height="24px"
        color="rgba(0,0,0,0.4)"
      ></NewPostIcon>
    ),
    to: "/admin/newPost",
  },
  {
    id: 4,
    tabName: "Edit",
    tabIconActive: () => (
      <EditIcon width="30px" height="30px" color="crimson"></EditIcon>
    ),
    tabIconInActive: () => (
      <EditIcon width="24px" height="24px" color="rgba(0,0,0,0.4)"></EditIcon>
    ),
    to: "/admin/customPost",
  },
  {
    id: 5,
    tabName: "LogOut",
    tabIconActive: () => (
      <LogoutIcon width="30px" height="30px" color="crimson"></LogoutIcon>
    ),
    tabIconInActive: () => (
      <LogoutIcon
        width="24px"
        height="24px"
        color="rgba(0,0,0,0.4)"
      ></LogoutIcon>
    ),
    to: "",
  },
];

export const rightIcon = {
  active: () => <RightIcon width="30px" height="30px" />,
  inActive: () => <RightIcon width="0px" height="0px" />,
};

export const leftIcon = {
  active: () => <LeftIcon width="30px" height="30px" />,
  inActive: () => <LeftIcon width="0px" height="0px" />,
};

export const dummyData = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWVuJTIwZmFjZXxlbnwwfHwwfHw%3D&w=1000&q=80",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWVufGVufDB8fDB8fA%3D%3D&w=1000&q=80",
  },
  {
    id: 3,
    imageUrl:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    id: 4,
    imageUrl:
      "https://i.pinimg.com/736x/3c/ca/8a/3cca8ad345d5bb1611befd76ba458026.jpg",
  },
];
