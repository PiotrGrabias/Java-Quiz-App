package com.QuizApp.dao;

import com.QuizApp.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TestResultDao extends JpaRepository<TestResult, Long> {
}