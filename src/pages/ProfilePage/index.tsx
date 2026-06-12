import { useState } from 'react';
import {
  useGetMyResourceQuery,
  useAddResourceSkillMutation,
  useUpdateResourceSkillMutation,
  useRemoveResourceSkillMutation,
} from '@/store/services/resourceApiSlice';
import { STRINGS } from '@/constants/strings';
import type { ResourceSkill } from '@/types/resource';
import { styles } from './profilePage.styles';

export default function ProfilePage() {
  const { data: resource, isLoading: loadingResource, refetch } = useGetMyResourceQuery();

  const [addSkill, { isLoading: addingSkill }] = useAddResourceSkillMutation();
  const [updateSkill] = useUpdateResourceSkillMutation();
  const [removeSkill] = useRemoveResourceSkillMutation();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER'>('BACKEND');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (loadingResource) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  if (!resource) {
    return <div className="card">Resource profile not found. Please contact your administrator.</div>;
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newSkillName.trim()) {
      setErrorMsg('Skill name is required');
      return;
    }

    try {
      await addSkill({
        resourceId: resource._id,
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency,
      }).unwrap();

      setSuccessMsg('Skill added successfully!');
      setNewSkillName('');
      refetch();
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setErrorMsg(errorPayload?.data?.error || 'Failed to add skill');
    }
  };

  const handleUpdateProficiency = async (skillId: string, proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateSkill({
        resourceId: resource._id,
        skillId,
        proficiency,
      }).unwrap();
      setSuccessMsg('Skill proficiency updated successfully!');
      refetch();
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setErrorMsg(errorPayload?.data?.error || 'Failed to update skill proficiency');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await removeSkill({
        resourceId: resource._id,
        skillId,
      }).unwrap();
      setSuccessMsg('Skill removed successfully!');
      refetch();
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setErrorMsg(errorPayload?.data?.error || 'Failed to remove skill');
    }
  };

  return (
    <div style={styles.container}>
      <h1>My Profile & Skills</h1>
      <p style={styles.headerSubtitle}>
        View your account profile, manage your skill catalog, and update skill proficiencies.
      </p>

      <div style={styles.gridOneCol}>
        <div className="card">
          <h2 style={styles.cardTitleNoTopMargin}>Basic Information</h2>
          <div style={styles.gridAutoCol}>
            <div>
              <span style={styles.infoLabel}>Full Name</span>
              <strong style={styles.infoValue}>{resource.fullName}</strong>
            </div>
            <div>
              <span style={styles.infoLabel}>Email Address</span>
              <strong style={styles.infoValue}>{resource.email}</strong>
            </div>
            <div>
              <span style={styles.infoLabel}>Designation</span>
              <strong style={styles.infoValue}>{resource.designation}</strong>
            </div>
            <div>
              <span style={styles.infoLabel}>Status</span>
              <strong style={styles.infoValue}>{resource.status}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Add a New Skill</h2>
          <form onSubmit={handleAddSkill} style={styles.formContainer}>
            <div>
              <label style={styles.fieldLabel}>Skill Name</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. React, Spring Boot, Docker..."
                style={styles.textInput}
              />
            </div>
            <div style={styles.gridTwoCol}>
              <div>
                <label style={styles.fieldLabel}>Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER')}
                  style={styles.selectInput}
                >
                  <option value="BACKEND">Backend</option>
                  <option value="FRONTEND">Frontend</option>
                  <option value="DEVOPS">DevOps</option>
                  <option value="QA">QA & Testing</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label style={styles.fieldLabel}>Proficiency</label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}
                  style={styles.selectInput}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
            {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

            <button
              type="submit"
              disabled={addingSkill}
              style={styles.submitButton(addingSkill)}
            >
              {addingSkill ? 'Adding...' : 'Add Skill'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>My Configured Skills</h2>
          {resource.skills.length === 0 ? (
            <p style={styles.emptyMessage}>You have not added any skills to your profile yet.</p>
          ) : (
            <div style={styles.skillsList}>
              {resource.skills.map((skill: ResourceSkill) => {
                const s = typeof skill.skillId === 'object' && skill.skillId ? skill.skillId : null;
                if (!s) return null;

                return (
                  <div
                    key={s._id}
                    style={styles.skillRow}
                  >
                    <div>
                      <strong style={styles.skillName}>{s.name}</strong>
                      <span style={styles.skillCategory}>
                        {s.category}
                      </span>
                    </div>
                    <div style={styles.actionsWrapper}>
                      <select
                        value={skill.proficiency}
                        onChange={(e) => handleUpdateProficiency(s._id, e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}
                        style={styles.proficiencySelect}
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                      <button
                        onClick={() => handleRemoveSkill(s._id)}
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
