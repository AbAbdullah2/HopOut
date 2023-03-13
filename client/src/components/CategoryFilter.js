import React, { useState } from 'react';

export default function CategoryFilter(props) {
  const { selectedFilters, setSelectedFilters } = props;

  const filters = [
    {key: 0, value: "sports"},
    {key: 1, value: "academics"},
    {key: 2, value: "arts"}
  ];

  const setChecked = (v) => {
    let sf = selectedFilters;
    if (sf.includes(v)) {
      sf = sf.filter((f) => {return f !== v});
    } else {
      sf.push(v);
    }
    console.log(sf);
    setSelectedFilters(sf);
  }

  return (
    <div>
      <button id="dropdownCheckboxButton" data-dropdown-toggle="dropdownDefaultCheckbox" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown checkbox <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
      <div id="dropdownDefaultCheckbox" className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
            {filters.map((f) => (
              <li key={f.key}>
                <div className="flex items-center">
                  <input id="checkbox-item-1" type="checkbox" checked={selectedFilters.includes(f.value)} onChange={(e) => {setChecked(f.value)}} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                  <label htmlFor="checkbox-item-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{f.value}</label>
                </div>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}