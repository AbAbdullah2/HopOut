import React from 'react';
import { Dropdown } from 'flowbite-react';
import categories from "../assets/categories";

export default function CategoryFilter(props) {
  const { selectedFilters, setSelectedFilters } = props;

  const setChecked = (v) => {
    if (selectedFilters.includes(v)) {
      setSelectedFilters(selectedFilters.filter((f) => {return f !== v}));
    } else {
      setSelectedFilters([...selectedFilters, v]);
    }
  }

  return (
    <Dropdown
        label={"Categories"}
        dismissOnClick={false}
      >
      {categories.map((f) => (
        <Dropdown.Item key={f.key}>
          <input id="checkbox-item-1" type="checkbox" checked={selectedFilters.includes(f.value)} onChange={(e) => {setChecked(f.value)}} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 p-2" />
          <span className="pl-2">{f.value}</span>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}