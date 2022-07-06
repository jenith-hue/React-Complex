import React, { useState } from 'react';
import { Footer } from '../../common/Footer/Footer';
import { PrintLetterProvider } from '../../context/PrintLetter/PrintLetterProvider';
import { SubNavigation } from '../SubNavigation/SubNavigation';
import { Filters } from './Filters/Filters';
import { PastDueCustomerList } from './PastDueCustomerList/PastDueCustomerList';
import { PastDueFooter } from './PastDueCustomerList/PastDueFooter';

export const PasDueList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <SubNavigation onFilterClick={toggleFilterPanel} />
      <Filters
        isOpen={isFilterOpen}
        handleToggleFilterPanel={toggleFilterPanel}
      />
      <PastDueCustomerList />
      <Footer>
        <PrintLetterProvider>
          <PastDueFooter />
        </PrintLetterProvider>
      </Footer>
    </>
  );
};
