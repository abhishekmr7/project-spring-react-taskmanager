package com.Taskmanager.TaskManagerProject;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")

public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    
    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) {
        Task created = service.create(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

   
    @GetMapping
    public List<Task> getAll() {
        return service.getAll();
    }

   
    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id) {
        return service.getById(id);
    }

    
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task) {
        return service.update(id, task);
    }

  
    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestParam("value") String statusValue) {
        Status status = parseStatus(statusValue);
        return service.updateStatus(id, status);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

   
    @GetMapping("/search")
    public List<Task> searchByTitle(@RequestParam("title") String title) {
        return service.searchByTitle(title);
    }

  
    @GetMapping("/status/{status}")
    public Page<Task> getByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate,asc") String sort) {

        Status parsed = parseStatus(status);
        Sort sortObj = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return service.getByStatus(parsed, pageable);
    }

   
    @GetMapping("/due-on")
    public List<Task> getByDueDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getByDueDate(date);
    }


    @GetMapping("/overdue")
    public List<Task> getOverdue(
            @RequestParam(name = "before", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate before,
            @RequestParam(name = "excludeStatus", defaultValue = "COMPLETED") String excludeStatus) {

        LocalDate cutoff = (before != null) ? before : LocalDate.now();
        Status excluded = parseStatus(excludeStatus);
        return service.getOverdueExcludingStatus(cutoff, excluded);
    }

   
    private Status parseStatus(String value) {
        try {
            return Status.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                "Invalid status: " + value + ". Allowed: PENDING, IN_PROGRESS, COMPLETED."
            );
        }
    }

    private Sort parseSort(String sortParam) {
        
        String[] parts = sortParam.split(",");
        String property = parts[0].trim();
        String direction = (parts.length > 1 ? parts[1].trim().toLowerCase() : "asc");
        return "desc".equals(direction) ? Sort.by(property).descending() : Sort.by(property).ascending();
    }
}