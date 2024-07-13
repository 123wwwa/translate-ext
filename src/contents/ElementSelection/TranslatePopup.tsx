import React from 'react';
import { TranslationsProvider } from '~shared/contexts/TranslationContext';
import TranslatePopupComponent from './TranslatePopupComponent';

interface TranslatePopupProps {
  selectionElement: HTMLElement;
  onClose: () => void;
}

const TranslatePopup: React.FC<TranslatePopupProps> = ({ selectionElement, onClose }) => (
  <TranslationsProvider selectionElement={selectionElement}>
    <TranslatePopupComponent onClose={onClose} />
  </TranslationsProvider>
);

export default TranslatePopup;
