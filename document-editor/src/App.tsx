import { useStore } from './store';
import Login from './components/Login';
import BankSelection from './components/BankSelection';
import ValuationTypeSelection from './components/ValuationTypeSelection';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';

function App() {
  const { currentUser, selectedBank, selectedValuationType, selectedDocument } = useStore();

  // Show login if no user is authenticated
  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!selectedBank && <BankSelection />}
      {selectedBank && !selectedValuationType && <ValuationTypeSelection />}
      {selectedBank && selectedValuationType && !selectedDocument && <DocumentList />}
      {selectedBank && selectedValuationType && selectedDocument && <DocumentEditor />}
    </div>
  );
}

export default App;
