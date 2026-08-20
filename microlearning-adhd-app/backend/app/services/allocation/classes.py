from dataclasses import dataclass


@dataclass(frozen=True)
class LearningConditionState:
    participant_n: int = 0
    experience_score_sum: int = 0
    experience_score_n: int = 0

    def update_learning_condition_state(
        self, prior_experience_score: int | None
    ) -> "LearningConditionState":
        return LearningConditionState(
            participant_n=self.participant_n + 1,
            experience_score_sum=self.experience_score_sum
            + (0 if prior_experience_score is None else prior_experience_score),
            experience_score_n=self.experience_score_n
            + (0 if prior_experience_score is None else 1),
        )

    @property
    def mean_experience_score(self) -> float | None:
        if self.experience_score_n == 0:
            return None
        return self.experience_score_sum / self.experience_score_n
