package com.Taskmanager.TaskManagerProject;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(Status status);

    Page<Task> findByStatus(Status status, Pageable pageable);

    List<Task> findByDueDate(LocalDate dueDate);

    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, Status status);

    List<Task> findByTitleContainingIgnoreCase(String titlePart);
}
