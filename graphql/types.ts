import { DocumentNode } from 'graphql';
import { EvaluationSessionTypes } from 'graphql/types/EvaluationSession';
import { ScriptTypes } from 'graphql/types/Script';

const customTypes: DocumentNode[] = [EvaluationSessionTypes, ScriptTypes];

export { customTypes };
