import { Tabs, TabsProps } from "antd";
import Learn from "../views/Learn";
import ListCrud from "../views/ListCrud";
import ListCourse from "../views/course/ListCourse";
import StudyCourse from "../views/course/StudyCourse";
import ListEconomy from "../views/economy/ListEconomy";
import ChartEconomy from "../views/economy/ChartEconomy";

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
  {
    key: "economy",
    label: "ECONOMY",
    children: <ListEconomy />,
  },
  {
    key: "chart_economy",
    label: "CHART ECONOMY",
    children: <ChartEconomy />,
  },
];

const SelectionDrawer = () => {
  return (
    <div className="h-full w-full !p-4">
      <Tabs items={items} defaultActiveKey={"learn"} />
    </div>
  );
};

export default SelectionDrawer;
