import { Tabs, TabsProps } from "antd";
import Learn from "../views/Learn";
import ListCrud from "../views/ListCrud";
import ListCourse from "../views/course/ListCourse";
import StudyCourse from "../views/course/StudyCourse";

const items: TabsProps["items"] = [
  {
    key: "crud",
    label: "CRUD",
    children: <ListCrud />,
  },
  {
    key: "learn",
    label: "LEARN",
    children: <Learn />,
  },
  {
    key: "course_crud",
    label: "COURSE CRUD",
    children: <ListCourse />,
  },
  {
    key: "study_course",
    label: "STUDY COURSE",
    children: <StudyCourse />,
  },
];

const SelectionDrawer = () => {
  return <Tabs items={items} activeKey={"learn"} />;
};

export default SelectionDrawer;
