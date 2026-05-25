import React from 'react';

// Define mandatory fields in Portuguese for display and checking
const MANDATORY_FIELDS = [
  'Nome completo', // displayName
  'Biografia',    // bio
  'URL da foto de perfil', // avatarUrl
  'Cargo',      // jobTitle
  'Empresa',     // company
  'Telefone',   // phone
  'WhatsApp'     // whatsapp
];

interface Profile {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
}

interface OnboardingChecklistProps {
  profile: Profile;
  onCompletion: (isCompleted: boolean) => void;
}

/**
 * Componente de Checklist de Onboarding.
 * Guia o usuário a preencher dados essenciais do perfil.
 */
const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ profile, onCompletion }) => {
  // Helper function to check if a field is present and non-empty
  const isFieldCompleted = (fieldValue?: string) => !!fieldValue && fieldValue.trim().length > 0;

  let completedFieldsCount = 0;
  
  // Map profile keys to the display names for checking logic
  const profileMap: { [key: string]: keyof Profile } = {
    'displayName': 'displayName',
    'bio': 'bio',
    'avatarUrl': 'avatarUrl',
    'jobTitle': 'jobTitle',
    'company': 'company',
    'phone': 'phone',
    'whatsapp': 'whatsapp',
  };

  // Check completion for each mandatory field
  MANDATORY_FIELDS.forEach(displayNamePT => {
    // Find the corresponding key in the profile object
    const actualKey = Object.keys(profileMap).find(key => displayNamePT === profileMap[key]);

    if (actualKey) {
      const fieldValue = profile[profileMap[actualKey]] as string | undefined;
      if (isFieldCompleted(fieldValue)) {
        completedFieldsCount += 1;
      }
    }
  });


  const totalFields = MANDATORY_FIELDS.length;
  const completionPercentage = ((completedFieldsCount / totalFields) * 100).toFixed(0);
  const isFullyCompleted = completedFieldsCount === totalFields;

  // Effect simulation: Call onCompletion when status changes (or upon initial render if complete)
  React.useEffect(() => {
    onCompletion(isFullyCompleted);
  }, [isFullyCompleted, onCompletion]);


  return (
    <div style={styles.container}>
      <h3>📝 Checklist de Onboarding</h3>
      <p style={styles.subtitle}>Preencha os campos abaixo para completar seu perfil.</p>

      {/* Progress Bar */}
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${completionPercentage}%` }}></div>
        <span style={styles.progressText}>{completedFieldsCount} de {totalFields} campos preenchidos ({completionPercentage}%)</span>
      </div>

      {/* Checklist Items */}
      <ul style={styles.checklistList}>
        {MANDATORY_FIELDS.map((displayNamePT, index) => {
          // Re-derive the actual key for checking status inside the map
          const actualKey = Object.keys(profileMap).find(key => displayNamePT === profileMap[key]);
          if (!actualKey) return null;

          const fieldValue = profile[profileMap[actualKey]] as string | undefined;
          const isCompletedItem = isFieldCompleted(fieldValue);
          
          return (
            <li key={index} style={styles.listItem}>
              <span style={{ ...styles.checkbox, backgroundColor: isCompletedItem ? '#4CAF50' : '#ccc' }}></span>
              {displayNamePT} 
              {!isCompletedItem && <span style={styles.statusText}>(Pendente)</span>}
            </li>
          );
        })}
      </ul>

      {/* Final Status Message */}
      <div style={isFullyCompleted ? styles.completeMessage : styles.incompleteMessage}>
        {isFullyCompleted 
          ? "✅ Perfil Completo! Ótimo trabalho!" 
          : `Por favor, preencha mais ${totalFields - completedFieldsCount} campos.`}
      </div>
    </div>
  );
};

// Minimal styling to simulate existing UI consistency
const styles = {
  container: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '500px', fontFamily: 'Arial, sans-serif' },
  subtitle: { fontSize: '0.9em', color: '#666', marginBottom: '15px' },
  progressBarContainer: { margin: '20px 0' },
  progressBar: { height: '8px', backgroundColor: '#4CAF50', transition: 'width 0.3s' },
  progressText: { display: 'block', textAlign: 'right', fontSize: '0.8em', color: '#333' },
  checklistList: { listStyle: 'none', padding: 0, marginBottom: '20px' },
  listItem: { display: 'flex', alignItems: 'center', marginBottom: '12px', fontSize: '1em' },
  checkbox: { width: '20px', height: '20px', borderRadius: '50%', marginRight: '10px', display: 'inline-block', border: '2px solid #333', backgroundColor: '#ccc', transition: 'background-color 0.3s' },
  statusText: { marginLeft: '8px', fontSize: '0.9em', color: 'red' },
  completeMessage: { padding: '15px', border: '2px solid #4CAF50', backgroundColor: '#e6ffe6', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' },
  incompleteMessage: { padding: '15px', border: '2px solid #ffc107', backgroundColor: '#fffbe6', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }
};

export default OnboardingChecklist;