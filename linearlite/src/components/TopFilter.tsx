import React from 'react'
import MenuIcon from '../assets/icons/menu.svg?react'
import { useState, useContext } from 'react'
import { BsSortUp, BsPlus, BsX, BsSearch as SearchIcon } from 'react-icons/bs'
import { ViewOptionMenu } from './ViewOptionMenu'
import { FilterMenu } from './contextmenu/FilterMenu'
import { PriorityOptions, StatusOptions } from '../types/issue'
import { useQuery } from '@livestore/react'
import { issueCount$, useFilterState } from '../domain/queries'
import { MenuContext } from '../context/MenuContext'

interface Props {
  filteredIssuesCount: number
  hideSort?: boolean
  showSearch?: boolean
  title?: string
}

export default function TopFilter({ filteredIssuesCount, hideSort, showSearch, title = 'All issues' }: Props) {
  const [showViewOption, setShowViewOption] = useState(false)
  const { showMenu, setShowMenu } = useContext(MenuContext)!
  const [searchQuery, setSearchQuery] = useState('')
  const totalIssuesCount = useQuery(issueCount$)
  const [filterState, setFilterState] = useFilterState()

  const handleSearchInner = (query: string) => setFilterState((_) => ({ ..._, query }))

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    handleSearchInner(query)
  }

  const eqStatuses = (statuses: string[]) => {
    const statusSet = new Set(statuses)
    return filterState.status?.length === statusSet.size && filterState.status.every((x) => statusSet.has(x))
  }

  if (filterState.status?.length) {
    if (eqStatuses(['backlog'])) {
      title = 'Backlog'
    } else if (eqStatuses(['todo', 'in_progress'])) {
      title = 'Active'
    }
  }

  return (
    <>
      <div className="flex justify-between flex-shrink-0 pl-2 pr-6 border-b border-gray-200 h-14 lg:pl-9">
        {/* left section */}
        <div className="flex items-center">
          <button className="flex-shrink-0 h-full px-5 lg:hidden" onClick={() => setShowMenu(!showMenu)}>
            <MenuIcon className="w-3.5 text-gray-500 hover:text-gray-800" />
          </button>

          <div className="p-1 font-semibold me-1">{title}</div>
          <span>
            {filteredIssuesCount}
            {filteredIssuesCount !== totalIssuesCount ? ` of ${totalIssuesCount}` : ''}
          </span>
          <FilterMenu
            button={
              <button className="px-1 py-0.5 ml-3 border border-gray-300 border-dashed rounded text-gray-500 hover:border-gray-400 hover:text-gray-800 flex items-center">
                <BsPlus className="inline" size="16" />
                Filter
              </button>
            }
            id={'filter-menu'}
          />
        </div>

        <div className="flex items-center">
          {!hideSort && (
            <button className="p-2 rounded hover:bg-gray-100" onClick={() => setShowViewOption(true)}>
              <BsSortUp size="16" className="inline" />
            </button>
          )}
        </div>
      </div>

      {(!!filterState.status?.length || !!filterState.priority?.length) && (
        <div className="flex flex-shrink-0 pl-2 pr-6 border-b border-gray-200 lg:pl-9 py-2">
          {!!filterState.priority?.length && (
            <div className="flex pr-4 space-x-[1px]">
              <span className="px-1 bg-gray-300 rounded-l">Priority is</span>
              <span className="px-1 bg-gray-300 ">
                {filterState.priority?.map((priority) => PriorityOptions[priority].display).join(', ')}
              </span>
              <span
                className="px-1 bg-gray-300 rounded-r cursor-pointer flex items-center"
                onClick={() => setFilterState((_) => ({ ..._, priority: undefined }))}
              >
                <BsX size={16} />
              </span>
            </div>
          )}
          {!!filterState.status?.length && (
            <div className="flex pr-4 space-x-[1px]">
              <span className="px-1 bg-gray-300 rounded-l">Status is</span>
              <span className="px-1 bg-gray-300 ">
                {filterState.status?.map((status) => StatusOptions[status].display).join(', ')}
              </span>
              <span
                className="px-1 bg-gray-300 rounded-r cursor-pointer flex items-center"
                onClick={() => setFilterState((_) => ({ ..._, status: undefined }))}
              >
                <BsX size={16} />
              </span>
            </div>
          )}
        </div>
      )}

      {showSearch && (
        <div className="flex items-center justify-between flex-shrink-0 pl-2 pr-6 border-b border-gray-200 lg:pl-9 py-2">
          <SearchIcon className="w-3.5 h-3.5 ms-3 absolute" />
          <input
            type="search"
            className="w-full bg-gray-100 border-0 rounded px-2 py-1.5 ps-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      <ViewOptionMenu isOpen={showViewOption} onDismiss={() => setShowViewOption(false)} />
    </>
  )
}
