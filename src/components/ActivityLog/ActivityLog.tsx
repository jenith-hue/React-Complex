import React, { useState } from 'react';
import { Footer } from '../../common/Footer/Footer';
import { SubNavigation } from '../SubNavigation/SubNavigation';
import { Filters } from './Filters/Filters';
import { ActivityLogList } from './ActivityLogList/ActivityLogList';
import { ActivityLogFooter } from './ActivityLogList/ActivityLogFooter';
import { ActivityLogSearchCriteriaProvider } from '../../context/ActivityLogSearchCriteria/ActivityLogSearchCriteriaProvider';
import ActivityLogResultProvider from '../../context/ActivityLogResult/ActivityLogResultProvider';

export const ActivityLog = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <ActivityLogSearchCriteriaProvider>
      <ActivityLogResultProvider>
        <SubNavigation
          title="A/M Activity Log Results"
          onFilterClick={toggleFilterPanel}
        />
        <Filters
          isOpen={isFilterOpen}
          handleToggleFilterPanel={toggleFilterPanel}
        />
        <ActivityLogList />
        <Footer>
          <ActivityLogFooter />
        </Footer>
      </ActivityLogResultProvider>
    </ActivityLogSearchCriteriaProvider>
  );
};
